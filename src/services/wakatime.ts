import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { WakaTimeStats, WakaTimeSummary, ApiResponse } from '@/types';

// WakaTime API服务类
export class WakaTimeService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.WAKATIME_API_KEY || '';
    console.log('WakaTime API Key loaded:', !!this.apiKey); // 添加此行验证
    this.baseURL = API_ENDPOINTS.WAKATIME.BASE_URL;
    
    if (!this.apiKey) {
      console.warn('WakaTime API Key not found in environment variables');
    }
  }

  // 获取认证头
  private getAuthHeaders() {
    if (!this.apiKey) {
      throw new Error('WakaTime API Key is required');
    }

    // 使用HTTP Basic Auth，API Key需要base64编码
    const encodedKey = Buffer.from(this.apiKey).toString('base64');
    
    return {
      'Authorization': `Basic ${encodedKey}`,
    };
  }

  // 获取总编码时长（从账户创建至今）
  async getAllTimeStats(): Promise<ApiResponse<WakaTimeStats['data']>> {
    try {
      const response = await get<WakaTimeStats>(
        API_ENDPOINTS.WAKATIME.ALL_TIME,
        {
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
        }
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to fetch WakaTime stats',
      };
    } catch (error) {
      return {
        success: false,
        error: `WakaTime API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // 获取指定时间范围的统计数据
  async getStats(range: string = 'last_7_days'): Promise<ApiResponse<unknown>> {
    try {
      const response = await get(
        `${API_ENDPOINTS.WAKATIME.STATS}/${range}`,
        {
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        error: `WakaTime Stats API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // 获取今日编码活动摘要
  async getTodaySummary(): Promise<ApiResponse<WakaTimeSummary>> {
    try {
      const response = await get<{ data: WakaTimeSummary }>(
        API_ENDPOINTS.WAKATIME.STATUS_BAR,
        {
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
        }
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to fetch today summary',
      };
    } catch (error) {
      return {
        success: false,
        error: `WakaTime Summary API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // 获取指定日期范围的摘要数据
  async getSummaries(
    startDate: string,
    endDate: string,
    project?: string
  ): Promise<ApiResponse<{ data: WakaTimeSummary[] }>> {
    try {
      const params = new URLSearchParams({
        start: startDate,
        end: endDate,
      });

      if (project) {
        params.append('project', project);
      }

      const response = await get<{ data: WakaTimeSummary[] }>(
        `${API_ENDPOINTS.WAKATIME.SUMMARIES}?${params.toString()}`,
        {
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        error: `WakaTime Summaries API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // 检查API连接状态
  async checkConnection(): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.getAllTimeStats();
      return {
        success: response.success,
        data: response.success,
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

// 创建单例实例
export const wakaTimeService = new WakaTimeService();

// 客户端API调用函数（使用内部API路由）
export async function getWakaTimeAllTime() {
  try {
    const response = await fetch('/api/wakatime?type=all_time');
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch WakaTime data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function getWakaTimeTodaySummary() {
  try {
    const response = await fetch('/api/wakatime?type=today');
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch WakaTime today summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function getWakaTimeStats(range: string = 'last_7_days') {
  try {
    const response = await fetch(`/api/wakatime?type=stats&range=${range}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch WakaTime stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function checkWakaTimeConnection() {
  try {
    const response = await fetch('/api/wakatime?type=check');
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: `Failed to check WakaTime connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
