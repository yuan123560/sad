// API响应基础类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WakaTime API相关类型
export interface WakaTimeStats {
  data: {
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: {
      end: string;
      end_date: string;
      end_text: string;
      start: string;
      start_date: string;
      start_text: string;
      timezone: string;
    };
    text: string;
    timeout: number;
    total_seconds: number;
    daily_average?: number;
  };
}

export interface WakaTimeSummary {
  grand_total: {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    text: string;
    total_seconds: number;
  };
  categories: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    decimal: string;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
  }>;
  languages: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    decimal: string;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  editors: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    decimal: string;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  range: {
    date: string;
    start: string;
    end: string;
    text: string;
    timezone: string;
  };
}

// QAnything API相关类型
export interface QAnythingChatRequest {
  question: string;
  kbIds: string[];
  prompt?: string;
  history: Array<{
    question: string;
    response: string;
  }>;
  model?: string;
  maxToken?: number;
  hybridSearch?: boolean;
  networking?: boolean;
  sourceNeeded?: boolean;
}

export interface QAnythingChatResponse {
  errorCode: number;
  msg: string;
  requestId: string;
  result: {
    question: string;
    response: string;
    history: Array<{
      question: string;
      response: string;
    }>;
    source?: Array<{
      fileId: string;
      fileName: string;
      content: string;
      score: string;
    }>;
    aiPointCost?: number;
  };
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    fileName: string;
    content: string;
    score: string;
  }>;
}

// 课程练习相关类型
export interface CourseExercise {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

// 通用状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// 响应码枚举
export enum ResponseCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// 提示消息类型
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
