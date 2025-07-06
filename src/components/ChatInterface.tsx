'use client';

import { useState, useRef, useCallback } from 'react';
import { ChatMessage, LoadingState } from '@/types';
import { generateId } from '@/lib/utils';
import ChatSettings, { ChatSettings as ChatSettingsType } from './ChatSettings';

interface ChatInterfaceProps {
  className?: string;
}

export default function ChatInterface({ className = '' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [chatSettings, setChatSettings] = useState<ChatSettingsType>({
    model: 'QAnything 4o mini',
    maxToken: 1024,
    hybridSearch: false,
    networking: false, // 默认关闭联网，与示例保持一致
    sourceNeeded: true,
    kbIds: [],
  });

  const [useDirectMode, setUseDirectMode] = useState(true); // 恢复直接模式
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 使用useRef来避免状态更新竞争条件
  const streamingRef = useRef<{
    accumulatedResponse: string;
    assistantMessageId: string;
    isComplete: boolean;
  }>({
    accumulatedResponse: '',
    assistantMessageId: '',
    isComplete: false,
  });

  // 处理设置变化
  const handleSettingsChange = useCallback((settings: ChatSettingsType) => {
    setChatSettings(settings);
  }, []);

  // 使用updater函数确保状态更新的正确性
  const updateStreamingMessage = useCallback((messageId: string, content: string, sources?: ChatMessage['sources']) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content, sources }
          : msg
      )
    );
  }, []);



  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || loading === 'loading') return;

    const userMessage: ChatMessage = {
      id: generateId(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // 先获取当前的历史消息（在添加新消息之前）
    const currentMessages = messages;

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading('loading');
    setError(null);

    // 创建助手消息
    const assistantMessage: ChatMessage = {
      id: generateId(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    // 初始化流式状态
    streamingRef.current = {
      accumulatedResponse: '',
      assistantMessageId: assistantMessage.id,
      isComplete: false,
    };

    try {
      // 准备历史记录（最近2轮对话，只包含完整的问答对）
      const history: Array<{ question: string; response: string }> = [];

      // 使用添加新消息前的消息列表来构建历史
      const historicalMessages = currentMessages;

      // 按顺序遍历历史消息，寻找完整的问答对
      for (let i = 0; i < historicalMessages.length; i++) {
        const currentMsg = historicalMessages[i];

        // 如果是用户消息，寻找下一个助手消息
        if (currentMsg.type === 'user') {
          // 寻找对应的助手回复
          for (let j = i + 1; j < historicalMessages.length; j++) {
            const nextMsg = historicalMessages[j];
            if (nextMsg.type === 'assistant' && nextMsg.content.trim().length > 0) {
              history.push({
                question: currentMsg.content,
                response: nextMsg.content,
              });
              break; // 找到对应回复后跳出内层循环
            }
          }
        }
      }

      // 只保留最近的2轮对话
      const recentHistory = history.slice(-2);

      // 检查是否选择了知识库
      if (chatSettings.kbIds.length === 0) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: '请先在设置中选择一个知识库，然后再提问。点击右上角的设置按钮选择知识库。' }
              : msg
          )
        );
        setLoading('error');
        return;
      }

      const requestData = {
        question: userMessage.content,
        kbIds: chatSettings.kbIds, // 使用设置中的知识库ID
        history: recentHistory,
        model: chatSettings.model,
        maxToken: chatSettings.maxToken,
        hybridSearch: chatSettings.hybridSearch,
        networking: chatSettings.networking,
        sourceNeeded: chatSettings.sourceNeeded,
      };

      // 根据设置选择API端点
      const apiEndpoint = useDirectMode ? '/api/qanything/stream-direct' : '/api/qanything/stream';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 基于Vercel AI SDK最佳实践的简化流式处理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 将新数据添加到缓冲区
          buffer += decoder.decode(value, { stream: true });

          // 按行分割处理
          const lines = buffer.split('\n');

          // 保留最后一行（可能不完整）
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const jsonStr = line.slice(5).trim();
                if (!jsonStr) continue;

                const data = JSON.parse(jsonStr);
                const errorCode = parseInt(data.errorCode, 10);

                if (errorCode === 0 && data.result) {
                  // 跳过最终chunk（包含question、history、source的chunk）以避免重复显示
                  if (data.result.question && data.result.history && data.result.source) {
                    console.log('Skipping final chunk to avoid duplication');
                    continue;
                  }

                  // 只处理增量chunk
                  if (data.result.response) {
                    streamingRef.current.accumulatedResponse += data.result.response;

                    // 立即更新UI
                    updateStreamingMessage(
                      streamingRef.current.assistantMessageId,
                      streamingRef.current.accumulatedResponse,
                      data.result.source
                    );
                  }
                } else if (errorCode !== 0) {
                  // 处理错误响应
                  const errorMessage = data.result?.response || data.msg || 'QAnything API error';
                  updateStreamingMessage(
                    streamingRef.current.assistantMessageId,
                    errorMessage
                  );
                  setError(data.msg || 'QAnything API error');
                  setLoading('error');
                  return;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // 检查是否收到了任何响应内容
      if (!streamingRef.current.accumulatedResponse) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: '抱歉，我没有找到相关的回答。请尝试重新表述您的问题或检查知识库设置。' }
              : msg
          )
        );
      }

      setLoading('success');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : '发生未知错误';
      setError(errorMessage);
      
      // 更新助手消息为错误信息
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: `抱歉，处理您的请求时出现了错误：${errorMessage}` }
            : msg
        )
      );
      
      setLoading('error');
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 清空聊天记录
  const clearChat = () => {
    setMessages([]);
    setError(null);
    setLoading('idle');
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-200 bg-yellow-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            {/* SVG图标保持不变 */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">AI 问答助手</h3>
            <p className="text-sm text-yellow-600">基于 QAnything 大语言模型</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ChatSettings onSettingsChange={handleSettingsChange} />

          {/* 性能模式切换 */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">
              {useDirectMode ? '直接模式' : '代理模式'}
            </span>
            <button
              onClick={() => setUseDirectMode(!useDirectMode)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:ring-offset-2 ${
                useDirectMode ? 'bg-[#1a365d]' : 'bg-gray-200'
              }`}
              title={useDirectMode ? '当前：直接模式（最佳性能）' : '当前：代理模式（可能有延迟）'}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  useDirectMode ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            清空对话
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>开始与 AI 助手对话吧！</p>
            <p className="text-sm mt-1">您可以询问任何问题，我会尽力为您解答。</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">信息来源：</p>
                    {message.sources.map((source, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">{source.fileName}</span>
                        <span className="ml-2 text-gray-400">置信度: {parseFloat(source.score).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading === 'loading' && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">AI 正在思考...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            className="flex-1 resize-none border border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows={1}
            disabled={loading === 'loading'}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading === 'loading'}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
