// API端点
export const API_ENDPOINTS = {
  // WakaTime API
  WAKATIME: {
    BASE_URL: 'https://api.wakatime.com/api/v1',
    ALL_TIME: '/users/current/all_time_since_today',
    STATS: '/users/current/stats',
    SUMMARIES: '/users/current/summaries',
    STATUS_BAR: '/users/current/status_bar/today',
  },
  
  // QAnything API
  QANYTHING: {
    BASE_URL: process.env.QANYTHING_API_BASE_URL || 'https://openapi.youdao.com/q_anything/api',
    CHAT_STREAM: '/chat_stream',
    BOT_CHAT_STREAM: '/bot/chat_stream',
  },
} as const;

// 响应消息
export const RESPONSE_MESSAGES = {
  SUCCESS: '操作成功',
  ERROR: '操作失败',
  LOADING: '加载中...',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  UNAUTHORIZED: '未授权访问，请检查API密钥',
  FORBIDDEN: '访问被拒绝',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误',
  VALIDATION_ERROR: '数据验证失败',
} as const;

// QAnything模型配置
export const QANYTHING_MODELS = {
  'QAnything 4o mini': {
    name: 'QAnything 4o mini',
    maxToken: { min: 512, max: 1024, default: 512 },
    description: '轻量级模型，响应速度快',
  },
  'QAnything 4o': {
    name: 'QAnything 4o',
    maxToken: { min: 1024, max: 4096, default: 1024 },
    description: '标准模型，平衡性能与质量',
  },
  'deepseek-pro': {
    name: 'deepseek-pro',
    maxToken: { min: 1024, max: 4096, default: 1024 },
    description: '专业模型，高质量回答',
  },
  'deepseek-lite': {
    name: 'deepseek-lite',
    maxToken: { min: 1024, max: 4096, default: 1024 },
    description: '轻量级专业模型',
  },
  'deepseek-chat': {
    name: 'deepseek-chat',
    maxToken: { min: 1024, max: 4096, default: 1024 },
    description: '对话优化模型',
  },
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  // QAnything默认配置
  QANYTHING: {
    model: 'QAnything 4o mini',
    maxToken: 1024,
    hybridSearch: false,
    networking: false, // 默认关闭联网，与示例保持一致
    sourceNeeded: true,
    kbIds: [], // 默认知识库ID，可以在环境变量中配置
  },
  
  // WakaTime默认配置
  WAKATIME: {
    timeout: 15, // 15分钟超时
    range: 'Today',
  },
  
  // UI配置
  UI: {
    toastDuration: 5000, // 5秒
    animationDuration: 300, // 300ms
    debounceDelay: 500, // 500ms防抖
  },
} as const;

// 课程练习分类
export const EXERCISE_CATEGORIES = {
  HTML: {
    name: 'HTML',
    color: '#E34F26',
    description: 'HTML基础练习',
  },
  CSS: {
    name: 'CSS',
    color: '#1572B6',
    description: 'CSS样式练习',
  },
  JAVASCRIPT: {
    name: 'JavaScript',
    color: '#F7DF1E',
    description: 'JavaScript编程练习',
  },
  REACT: {
    name: 'React',
    color: '#61DAFB',
    description: 'React框架练习',
  },
  NEXTJS: {
    name: 'Next.js',
    color: '#000000',
    description: 'Next.js全栈练习',
  },
  PROJECT: {
    name: '综合项目',
    color: '#8B5CF6',
    description: '综合性项目练习',
  },
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'course_showcase_chat_history',
  USER_PREFERENCES: 'course_showcase_user_preferences',
  WAKATIME_CACHE: 'course_showcase_wakatime_cache',
} as const;

// 正则表达式
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  API_KEY: /^[a-zA-Z0-9_-]+$/,
} as const;

// 错误代码
export const ERROR_CODES = {
  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // API错误
  API_KEY_INVALID: 'API_KEY_INVALID',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  
  // 数据错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  
  // 系统错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;
