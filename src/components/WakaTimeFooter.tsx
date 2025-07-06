'use client';

import { useEffect, useState } from 'react';
import { getWakaTimeAllTime } from '@/services/wakatime';
import { formatTime } from '@/lib/utils';
import { WakaTimeStats } from '@/types';

interface WakaTimeFooterProps {
  className?: string;
}

export default function WakaTimeFooter({ className = '' }: WakaTimeFooterProps) {
  const [stats, setStats] = useState<WakaTimeStats['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getWakaTimeAllTime();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || '获取编码时长失败');
        }
      } catch (err) {
        setError('网络连接失败');
        console.error('Failed to fetch WakaTime stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <footer className={`bg-gray-50 border-t border-gray-200 py-4 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">加载编码时长数据...</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className={`bg-gray-50 border-t border-gray-200 py-4 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <footer className={`bg-yellow-50 border-t border-yellow-200 py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* 主要统计信息 */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">总编码时长</p>
                <p className="text-lg font-semibold text-yellow-500">
                  {stats.text || formatTime(stats.total_seconds)}
                </p>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-300"></div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">日均编码时长</p>
                <p className="text-lg font-semibold text-yellow-500">
                  {formatTime(stats.daily_average || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* 时间范围信息 */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              统计时间范围
            </p>
            <p className="text-sm font-medium text-gray-900">
              {stats.range?.start_text} 至 {stats.range?.end_text}
            </p>
            <div className="flex items-center justify-center md:justify-end space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${stats.is_up_to_date ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-gray-500">
                {stats.is_up_to_date ? '数据已更新' : `更新进度 ${stats.percent_calculated}%`}
              </span>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span>数据来源: WakaTime API</span>
              <span>•</span>
              <span>超时设置: {stats.timeout} 分钟</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <a 
                href="https://wakatime.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                WakaTime
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
