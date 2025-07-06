module.exports = {

"[project]/.next-internal/server/app/api/wakatime/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/api.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ApiError": (()=>ApiError),
    "apiRequest": (()=>apiRequest),
    "del": (()=>del),
    "get": (()=>get),
    "handleApiError": (()=>handleApiError),
    "post": (()=>post),
    "put": (()=>put),
    "streamRequest": (()=>streamRequest)
});
// API配置
const API_CONFIG = {
    timeout: 30000,
    retries: 3
};
class ApiError extends Error {
    code;
    status;
    details;
    constructor(code, message, status, details){
        super(message), this.code = code, this.status = status, this.details = details;
        this.name = 'ApiError';
    }
}
// 创建带超时的fetch
function fetchWithTimeout(url, options = {}) {
    const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;
    return new Promise((resolve, reject)=>{
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>{
            controller.abort();
            reject(new ApiError('TIMEOUT', `请求超时 (${timeout}ms)`));
        }, timeout);
        fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        }).then(resolve).catch(reject).finally(()=>clearTimeout(timeoutId));
    });
}
async function apiRequest(url, config = {}) {
    const { retries = API_CONFIG.retries, baseURL = '', headers = {}, ...options } = config;
    const fullUrl = baseURL ? `${baseURL}${url}` : url;
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    let lastError = new Error('未知错误');
    for(let attempt = 0; attempt <= retries; attempt++){
        try {
            const response = await fetchWithTimeout(fullUrl, {
                ...options,
                headers: requestHeaders
            });
            // 检查HTTP状态码
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch  {
                    // 如果不是JSON，使用原始错误文本
                    if (errorText) {
                        errorMessage = errorText;
                    }
                }
                throw new ApiError(`HTTP_${response.status}`, errorMessage, response.status);
            }
            // 解析响应
            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            lastError = error;
            // 如果是最后一次尝试，抛出错误
            if (attempt === retries) {
                break;
            }
            // 等待一段时间后重试
            await new Promise((resolve)=>setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
    // 处理最终错误
    if (lastError instanceof ApiError) {
        return {
            success: false,
            error: lastError.message
        };
    }
    return {
        success: false,
        error: lastError.message || '未知错误'
    };
}
function get(url, config) {
    return apiRequest(url, {
        ...config,
        method: 'GET'
    });
}
function post(url, data, config) {
    return apiRequest(url, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
    });
}
function put(url, data, config) {
    return apiRequest(url, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
    });
}
function del(url, config) {
    return apiRequest(url, {
        ...config,
        method: 'DELETE'
    });
}
async function streamRequest(url, config = {}, onChunk) {
    const { headers = {}, ...options } = config;
    const response = await fetchWithTimeout(url, {
        ...options,
        headers: {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
            ...headers
        }
    });
    if (!response.ok) {
        throw new ApiError(`HTTP_${response.status}`, `HTTP ${response.status}: ${response.statusText}`, response.status);
    }
    const reader = response.body?.getReader();
    if (!reader) {
        throw new ApiError('STREAM_ERROR', '无法读取响应流');
    }
    const decoder = new TextDecoder();
    try {
        while(true){
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {
                stream: true
            });
            onChunk(chunk);
        }
    } finally{
        reader.releaseLock();
    }
}
function handleApiError(error) {
    if (error instanceof ApiError) {
        return {
            code: error.code,
            message: error.message,
            details: error.details
        };
    }
    return {
        code: 'UNKNOWN_ERROR',
        message: error?.message || '发生未知错误',
        details: error
    };
}
}}),
"[project]/src/lib/constants.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// API端点
__turbopack_context__.s({
    "API_ENDPOINTS": (()=>API_ENDPOINTS),
    "DEFAULT_CONFIG": (()=>DEFAULT_CONFIG),
    "ERROR_CODES": (()=>ERROR_CODES),
    "EXERCISE_CATEGORIES": (()=>EXERCISE_CATEGORIES),
    "QANYTHING_MODELS": (()=>QANYTHING_MODELS),
    "REGEX_PATTERNS": (()=>REGEX_PATTERNS),
    "RESPONSE_MESSAGES": (()=>RESPONSE_MESSAGES),
    "STORAGE_KEYS": (()=>STORAGE_KEYS)
});
const API_ENDPOINTS = {
    // WakaTime API
    WAKATIME: {
        BASE_URL: 'https://api.wakatime.com/api/v1',
        ALL_TIME: '/users/current/all_time_since_today',
        STATS: '/users/current/stats',
        SUMMARIES: '/users/current/summaries',
        STATUS_BAR: '/users/current/status_bar/today'
    },
    // QAnything API
    QANYTHING: {
        BASE_URL: process.env.QANYTHING_API_BASE_URL || 'https://openapi.youdao.com/q_anything/api',
        CHAT_STREAM: '/chat_stream',
        BOT_CHAT_STREAM: '/bot/chat_stream'
    }
};
const RESPONSE_MESSAGES = {
    SUCCESS: '操作成功',
    ERROR: '操作失败',
    LOADING: '加载中...',
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    TIMEOUT_ERROR: '请求超时，请稍后重试',
    UNAUTHORIZED: '未授权访问，请检查API密钥',
    FORBIDDEN: '访问被拒绝',
    NOT_FOUND: '请求的资源不存在',
    SERVER_ERROR: '服务器内部错误',
    VALIDATION_ERROR: '数据验证失败'
};
const QANYTHING_MODELS = {
    'QAnything 4o mini': {
        name: 'QAnything 4o mini',
        maxToken: {
            min: 512,
            max: 1024,
            default: 512
        },
        description: '轻量级模型，响应速度快'
    },
    'QAnything 4o': {
        name: 'QAnything 4o',
        maxToken: {
            min: 1024,
            max: 4096,
            default: 1024
        },
        description: '标准模型，平衡性能与质量'
    },
    'deepseek-pro': {
        name: 'deepseek-pro',
        maxToken: {
            min: 1024,
            max: 4096,
            default: 1024
        },
        description: '专业模型，高质量回答'
    },
    'deepseek-lite': {
        name: 'deepseek-lite',
        maxToken: {
            min: 1024,
            max: 4096,
            default: 1024
        },
        description: '轻量级专业模型'
    },
    'deepseek-chat': {
        name: 'deepseek-chat',
        maxToken: {
            min: 1024,
            max: 4096,
            default: 1024
        },
        description: '对话优化模型'
    }
};
const DEFAULT_CONFIG = {
    // QAnything默认配置
    QANYTHING: {
        model: 'QAnything 4o mini',
        maxToken: 1024,
        hybridSearch: false,
        networking: false,
        sourceNeeded: true,
        kbIds: []
    },
    // WakaTime默认配置
    WAKATIME: {
        timeout: 15,
        range: 'Today'
    },
    // UI配置
    UI: {
        toastDuration: 5000,
        animationDuration: 300,
        debounceDelay: 500
    }
};
const EXERCISE_CATEGORIES = {
    HTML: {
        name: 'HTML',
        color: '#E34F26',
        description: 'HTML基础练习'
    },
    CSS: {
        name: 'CSS',
        color: '#1572B6',
        description: 'CSS样式练习'
    },
    JAVASCRIPT: {
        name: 'JavaScript',
        color: '#F7DF1E',
        description: 'JavaScript编程练习'
    },
    REACT: {
        name: 'React',
        color: '#61DAFB',
        description: 'React框架练习'
    },
    NEXTJS: {
        name: 'Next.js',
        color: '#000000',
        description: 'Next.js全栈练习'
    },
    PROJECT: {
        name: '综合项目',
        color: '#8B5CF6',
        description: '综合性项目练习'
    }
};
const STORAGE_KEYS = {
    CHAT_HISTORY: 'course_showcase_chat_history',
    USER_PREFERENCES: 'course_showcase_user_preferences',
    WAKATIME_CACHE: 'course_showcase_wakatime_cache'
};
const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL: /^https?:\/\/.+/,
    API_KEY: /^[a-zA-Z0-9_-]+$/
};
const ERROR_CODES = {
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
    SERVER_ERROR: 'SERVER_ERROR'
};
}}),
"[project]/src/services/wakatime.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WakaTimeService": (()=>WakaTimeService),
    "checkWakaTimeConnection": (()=>checkWakaTimeConnection),
    "getWakaTimeAllTime": (()=>getWakaTimeAllTime),
    "getWakaTimeStats": (()=>getWakaTimeStats),
    "getWakaTimeTodaySummary": (()=>getWakaTimeTodaySummary),
    "wakaTimeService": (()=>wakaTimeService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-route] (ecmascript)");
;
;
class WakaTimeService {
    apiKey;
    baseURL;
    constructor(){
        this.apiKey = process.env.WAKATIME_API_KEY || '';
        console.log('WakaTime API Key loaded:', !!this.apiKey); // 添加此行验证
        this.baseURL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].WAKATIME.BASE_URL;
        if (!this.apiKey) {
            console.warn('WakaTime API Key not found in environment variables');
        }
    }
    // 获取认证头
    getAuthHeaders() {
        if (!this.apiKey) {
            throw new Error('WakaTime API Key is required');
        }
        // 使用HTTP Basic Auth，API Key需要base64编码
        const encodedKey = Buffer.from(this.apiKey).toString('base64');
        return {
            'Authorization': `Basic ${encodedKey}`
        };
    }
    // 获取总编码时长（从账户创建至今）
    async getAllTimeStats() {
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].WAKATIME.ALL_TIME, {
                baseURL: this.baseURL,
                headers: this.getAuthHeaders()
            });
            if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                error: response.error || 'Failed to fetch WakaTime stats'
            };
        } catch (error) {
            return {
                success: false,
                error: `WakaTime API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // 获取指定时间范围的统计数据
    async getStats(range = 'last_7_days') {
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].WAKATIME.STATS}/${range}`, {
                baseURL: this.baseURL,
                headers: this.getAuthHeaders()
            });
            return response;
        } catch (error) {
            return {
                success: false,
                error: `WakaTime Stats API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // 获取今日编码活动摘要
    async getTodaySummary() {
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].WAKATIME.STATUS_BAR, {
                baseURL: this.baseURL,
                headers: this.getAuthHeaders()
            });
            if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                error: response.error || 'Failed to fetch today summary'
            };
        } catch (error) {
            return {
                success: false,
                error: `WakaTime Summary API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // 获取指定日期范围的摘要数据
    async getSummaries(startDate, endDate, project) {
        try {
            const params = new URLSearchParams({
                start: startDate,
                end: endDate
            });
            if (project) {
                params.append('project', project);
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].WAKATIME.SUMMARIES}?${params.toString()}`, {
                baseURL: this.baseURL,
                headers: this.getAuthHeaders()
            });
            return response;
        } catch (error) {
            return {
                success: false,
                error: `WakaTime Summaries API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // 检查API连接状态
    async checkConnection() {
        try {
            const response = await this.getAllTimeStats();
            return {
                success: response.success,
                data: response.success,
                error: response.error
            };
        } catch (error) {
            return {
                success: false,
                data: false,
                error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
const wakaTimeService = new WakaTimeService();
async function getWakaTimeAllTime() {
    try {
        const response = await fetch('/api/wakatime?type=all_time');
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: `Failed to fetch WakaTime data: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
async function getWakaTimeTodaySummary() {
    try {
        const response = await fetch('/api/wakatime?type=today');
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: `Failed to fetch WakaTime today summary: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
async function getWakaTimeStats(range = 'last_7_days') {
    try {
        const response = await fetch(`/api/wakatime?type=stats&range=${range}`);
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: `Failed to fetch WakaTime stats: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
async function checkWakaTimeConnection() {
    try {
        const response = await fetch('/api/wakatime?type=check');
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: `Failed to check WakaTime connection: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
}}),
"[project]/src/app/api/wakatime/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$wakatime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/wakatime.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all_time';
        const range = searchParams.get('range') || 'last_7_days';
        let response;
        switch(type){
            case 'all_time':
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$wakatime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wakaTimeService"].getAllTimeStats();
                break;
            case 'today':
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$wakatime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wakaTimeService"].getTodaySummary();
                break;
            case 'stats':
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$wakatime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wakaTimeService"].getStats(range);
                break;
            case 'check':
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$wakatime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wakaTimeService"].checkConnection();
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid type parameter'
                }, {
                    status: 400
                });
        }
        if (response.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
                status: 500
            });
        }
    } catch (error) {
        console.error('WakaTime API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__1e735060._.js.map