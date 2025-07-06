import { streamRequest, post } from '@/lib/api';
import { API_ENDPOINTS, DEFAULT_CONFIG, QANYTHING_MODELS } from '@/lib/constants';
import { QAnythingChatRequest, QAnythingChatResponse, ApiResponse } from '@/types';

// QAnything API服务类
export class QAnythingService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.QANYTHING_API_KEY || '';
    this.baseURL = API_ENDPOINTS.QANYTHING.BASE_URL;
    
    if (!this.apiKey) {
      console.warn('QAnything API Key not found in environment variables');
    }
  }

  // 获取认证头
  private getAuthHeaders() {
    if (!this.apiKey) {
      throw new Error('QAnything API Key is required');
    }

    return {
      'Authorization': this.apiKey,
    };
  }

  // 流式聊天（知识库问答）
  async streamChat(
    request: QAnythingChatRequest,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const requestData = {
        ...DEFAULT_CONFIG.QANYTHING,
        ...request,
      };

      await streamRequest(
        API_ENDPOINTS.QANYTHING.CHAT_STREAM,
        {
          method: 'POST',
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestData),
        },
        (chunk: string) => {
          // 处理服务器发送的事件流
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.errorCode === 0 && data.result?.response) {
                  // QAnything API返回的response字段是增量内容，调用方需要自行累加
                  onChunk(data.result.response);
                } else if (data.errorCode !== 0) {
                  onError?.(data.msg || 'QAnything API error');
                }
              } catch {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      );

      onComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
      throw error;
    }
  }

  // 普通聊天请求（非流式）
  async chat(request: QAnythingChatRequest): Promise<ApiResponse<QAnythingChatResponse['result']>> {
    try {
      const requestData = {
        ...DEFAULT_CONFIG.QANYTHING,
        ...request,
      };

      const response = await post<QAnythingChatResponse>(
        '/chat', // 假设有非流式接口
        requestData,
        {
          baseURL: this.baseURL,
          headers: this.getAuthHeaders(),
        }
      );

      if (response.success && response.data) {
        if (response.data.errorCode === 0) {
          return {
            success: true,
            data: response.data.result,
          };
        } else {
          return {
            success: false,
            error: response.data.msg || 'QAnything API error',
          };
        }
      }

      return {
        success: false,
        error: response.error || 'Failed to get response from QAnything',
      };
    } catch (error) {
      return {
        success: false,
        error: `QAnything API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // 检查API连接状态
  async checkConnection(): Promise<ApiResponse<boolean>> {
    try {
      const testRequest: QAnythingChatRequest = {
        question: '你好',
        kbIds: [],
        history: [],
        model: 'QAnything 4o mini',
        maxToken: 100,
      };

      const response = await this.chat(testRequest);
      
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

  // 获取可用模型列表
  getAvailableModels() {
    return Object.values(QANYTHING_MODELS);
  }

  // 验证请求参数
  validateRequest(request: QAnythingChatRequest): { valid: boolean; error?: string } {
    if (!request.question || request.question.trim().length === 0) {
      return { valid: false, error: '问题不能为空' };
    }

    if (request.question.length > 200) {
      return { valid: false, error: '问题长度不能超过200个字符' };
    }

    if (!Array.isArray(request.kbIds)) {
      return { valid: false, error: '知识库ID必须是数组' };
    }

    if (!Array.isArray(request.history)) {
      return { valid: false, error: '历史记录必须是数组' };
    }

    if (request.history.length > 2) {
      return { valid: false, error: '历史记录最多支持2轮对话' };
    }

    if (request.prompt && request.prompt.length > 500) {
      return { valid: false, error: 'Prompt长度不能超过500个字符' };
    }

    return { valid: true };
  }
}

// 创建单例实例
export const qAnythingService = new QAnythingService();

// 便捷函数
export async function streamQAnythingChat(
  question: string,
  options: Partial<QAnythingChatRequest> = {},
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: string) => void
) {
  const request: QAnythingChatRequest = {
    question,
    kbIds: [],
    history: [],
    ...options,
  };

  return qAnythingService.streamChat(request, onChunk, onComplete, onError);
}

export async function sendQAnythingMessage(
  question: string,
  options: Partial<QAnythingChatRequest> = {}
) {
  const request: QAnythingChatRequest = {
    question,
    kbIds: [],
    history: [],
    ...options,
  };

  return qAnythingService.chat(request);
}

export async function checkQAnythingConnection() {
  return qAnythingService.checkConnection();
}

export function getQAnythingModels() {
  return qAnythingService.getAvailableModels();
}
