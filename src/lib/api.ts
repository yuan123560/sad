import { ApiResponse, AppError } from '@/types';

// API配置
const API_CONFIG = {
  timeout: 30000, // 30秒超时
  retries: 3, // 重试次数
};

// 自定义错误类
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  baseURL?: string;
}

// 创建带超时的fetch
function fetchWithTimeout(
  url: string,
  options: RequestConfig = {}
): Promise<Response> {
  const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new ApiError('TIMEOUT', `请求超时 (${timeout}ms)`));
    }, timeout);

    fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

// 通用API请求函数
export async function apiRequest<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    retries = API_CONFIG.retries,
    baseURL = '',
    headers = {},
    ...options
  } = config;

  const fullUrl = baseURL ? `${baseURL}${url}` : url;
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  let lastError: Error = new Error('未知错误');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(fullUrl, {
        ...options,
        headers: requestHeaders,
      });

      // 检查HTTP状态码
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // 如果不是JSON，使用原始错误文本
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new ApiError(
          `HTTP_${response.status}`,
          errorMessage,
          response.status
        );
      }

      // 解析响应
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      lastError = error as Error;
      
      // 如果是最后一次尝试，抛出错误
      if (attempt === retries) {
        break;
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  // 处理最终错误
  if (lastError instanceof ApiError) {
    return {
      success: false,
      error: lastError.message,
    };
  }

  return {
    success: false,
    error: lastError.message || '未知错误',
  };
}

// GET请求
export function get<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...config, method: 'GET' });
}

// POST请求
export function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT请求
export function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE请求
export function del<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...config, method: 'DELETE' });
}

// 流式请求处理
export async function streamRequest(
  url: string,
  config: RequestConfig = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  const { headers = {}, ...options } = config;
  
  const response = await fetchWithTimeout(url, {
    ...options,
    headers: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `HTTP_${response.status}`,
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError('STREAM_ERROR', '无法读取响应流');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } finally {
    reader.releaseLock();
  }
}

// 错误处理工具
export function handleApiError(error: any): AppError {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || '发生未知错误',
    details: error,
  };
}
