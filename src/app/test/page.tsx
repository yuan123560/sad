'use client';

import { useState } from 'react';

export default function TestPage() {
  const [wakaTimeResult, setWakaTimeResult] = useState<Record<string, unknown> | null>(null);
  const [qanythingResult, setQanythingResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<{ wakatime: boolean; qanything: boolean }>({
    wakatime: false,
    qanything: false,
  });

  const testWakaTime = async () => {
    setLoading(prev => ({ ...prev, wakatime: true }));
    try {
      const response = await fetch('/api/wakatime?type=check');
      const result = await response.json();
      setWakaTimeResult(result);
    } catch (error) {
      setWakaTimeResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(prev => ({ ...prev, wakatime: false }));
    }
  };

  const testQAnything = async () => {
    setLoading(prev => ({ ...prev, qanything: true }));
    try {
      const response = await fetch('/api/qanything/test');
      const result = await response.json();
      setQanythingResult(result);
    } catch (error) {
      setQanythingResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(prev => ({ ...prev, qanything: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">API 测试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WakaTime API 测试 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">WakaTime API 测试</h2>
          
          <button
            onClick={testWakaTime}
            disabled={loading.wakatime}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading.wakatime ? '测试中...' : '测试 WakaTime API'}
          </button>
          
          {wakaTimeResult && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-800 mb-2">测试结果:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                {JSON.stringify(wakaTimeResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* QAnything API 测试 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">QAnything API 测试</h2>
          
          <button
            onClick={testQAnything}
            disabled={loading.qanything}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading.qanything ? '测试中...' : '测试 QAnything API'}
          </button>
          
          {qanythingResult && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-800 mb-2">测试结果:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                {JSON.stringify(qanythingResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* 环境变量检查 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">环境变量检查</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">WAKATIME_API_KEY:</span>
            <span className={`px-2 py-1 rounded ${process.env.NEXT_PUBLIC_WAKATIME_CHECK ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {process.env.NEXT_PUBLIC_WAKATIME_CHECK ? '已配置' : '未配置'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">QANYTHING_API_KEY:</span>
            <span className={`px-2 py-1 rounded ${process.env.NEXT_PUBLIC_QANYTHING_CHECK ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {process.env.NEXT_PUBLIC_QANYTHING_CHECK ? '已配置' : '未配置'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>注意:</strong> 如果API密钥显示未配置，请检查 .env.local 文件是否正确设置了环境变量，并重启开发服务器。
          </p>
        </div>
      </div>
    </div>
  );
}
