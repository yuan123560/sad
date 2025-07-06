'use client';

import { useState, useEffect, useCallback } from 'react';
import { QANYTHING_MODELS } from '@/lib/constants';

interface ChatSettingsProps {
  onSettingsChange: (settings: ChatSettings) => void;
  className?: string;
}

export interface ChatSettings {
  model: string;
  maxToken: number;
  hybridSearch: boolean;
  networking: boolean;
  sourceNeeded: boolean;
  kbIds: string[];
}

interface KnowledgeBase {
  kbId: string;
  kbName: string;
  status: number;
}

export default function ChatSettings({ onSettingsChange, className = '' }: ChatSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'QAnything 4o mini',
    maxToken: 1024,
    hybridSearch: false,
    networking: false, // 默认关闭联网，与示例保持一致
    sourceNeeded: true,
    kbIds: [],
  });
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取知识库列表
  const fetchKnowledgeBases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qanything/kb-list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.knowledgeBases) {
          setKnowledgeBases(data.knowledgeBases);

          // 自动选择第一个有内容的知识库（status === 1）
          const readyKb = data.knowledgeBases.find((kb: KnowledgeBase) => kb.status === 1);
          if (readyKb && settings.kbIds.length === 0) {
            console.log('Auto-selecting ready knowledge base:', readyKb.kbId, readyKb.kbName);
            setSettings(prev => ({
              ...prev,
              kbIds: [readyKb.kbId]
            }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
    } finally {
      setLoading(false);
    }
  }, [settings.kbIds]);

  useEffect(() => {
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases]);

  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const updateSetting = <K extends keyof ChatSettings>(
    key: K,
    value: ChatSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleKnowledgeBase = (kbId: string) => {
    setSettings(prev => ({
      ...prev,
      kbIds: prev.kbIds.includes(kbId)
        ? prev.kbIds.filter(id => id !== kbId)
        : [...prev.kbIds, kbId]
    }));
  };

  return (
    <div className={`relative ${className}`}>
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        title="聊天设置"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* 设置面板 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">聊天设置</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 模型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI 模型
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => updateSetting('model', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(QANYTHING_MODELS).map(([key, model]) => (
                    <option key={key} value={model.name}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 最大Token数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大Token数: {settings.maxToken}
                </label>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={settings.maxToken}
                  onChange={(e) => updateSetting('maxToken', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>512</span>
                  <span>4096</span>
                </div>
              </div>

              {/* 功能开关 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    混合搜索
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.hybridSearch}
                    onChange={(e) => updateSetting('hybridSearch', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    联网搜索
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.networking}
                    onChange={(e) => updateSetting('networking', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    显示信息源
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.sourceNeeded}
                    onChange={(e) => updateSetting('sourceNeeded', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 知识库选择 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    知识库选择
                  </label>
                  <button
                    onClick={fetchKnowledgeBases}
                    disabled={loading}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {loading ? '刷新中...' : '刷新'}
                  </button>
                </div>
                
                {knowledgeBases.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {knowledgeBases.map((kb) => (
                      <div key={kb.kbId} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={kb.kbId}
                          checked={settings.kbIds.includes(kb.kbId)}
                          onChange={() => toggleKnowledgeBase(kb.kbId)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={kb.kbId} className="text-sm text-gray-700 flex-1">
                          {kb.kbName}
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          kb.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {kb.status === 1 ? '就绪' : '处理中'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {loading ? '加载中...' : '暂无知识库'}
                  </p>
                )}
              </div>

              {/* 当前配置摘要 */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  当前配置: {settings.model}, {settings.maxToken} tokens
                  {settings.kbIds.length > 0 && `, ${settings.kbIds.length} 个知识库`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
