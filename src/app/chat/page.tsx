import { Metadata } from 'next';
import ChatInterface from '@/components/ChatInterface';

export const metadata: Metadata = {
  title: 'AI 问答 - Course Showcase',
  description: '与基于QAnything大语言模型的AI助手对话，获得学习指导和答疑解惑。',
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI 智能问答
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              基于 QAnything 大语言模型的智能问答服务，为您的学习过程提供专业指导和答疑解惑。
              您可以询问任何关于前端开发、编程学习或技术问题的内容。
            </p>
            
            {/* 功能特点 */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm text-blue-800">实时流式回答</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-800">专业技术支持</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-purple-800">24/7 在线服务</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 聊天界面 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-[600px]">
            <ChatInterface />
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">使用提示</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">💡 提问技巧</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 尽量描述具体的问题和场景</li>
                  <li>• 提供相关的代码片段或错误信息</li>
                  <li>• 说明您的技术背景和学习目标</li>
                  <li>• 一次只问一个主要问题</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">🎯 适用场景</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• HTML/CSS 布局和样式问题</li>
                  <li>• JavaScript 语法和逻辑疑问</li>
                  <li>• React/Next.js 开发指导</li>
                  <li>• 前端工程化和最佳实践</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">注意事项</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    AI 助手会尽力提供准确的信息，但建议您在实际应用前验证答案的正确性。
                    对于复杂的技术问题，建议结合官方文档和其他权威资源。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
