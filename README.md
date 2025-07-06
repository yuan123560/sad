# 《web前端技术》

一个集课程练习展示、编码时长统计和AI问答于一体的个人学习平台。
<img src="public\screenshot-20250706.png" alt="期末作业主页" width="800">

## 📖 项目简介

《web 前端技术》 是一个现代化的个人学习展示平台，旨在系统化地记录和展示前端开发学习过程中的所有练习项目。该平台不仅仅是一个简单的作品集，更是一个集成了多种先进技术的综合性学习工具。
<img src="public\screenshot.png" alt="期末作业主页" width="800">
### 主要功能

- 📚 **课程练习展示**: 系统化展示HTML、CSS、JavaScript、React、Next.js等技术栈的学习练习
<img src="public\4.png" alt="期末作业主页" width="800">
<img src="public\5.png" alt="期末作业主页" width="800">
- ⏱️ **编码时长统计**: 集成WakaTime API，实时展示编码时长和学习进度统计
<img src="public\3.png" alt="期末作业主页" width="800">
- 🤖 **AI智能问答**: 基于QAnything大语言模型，提供智能问答服务，解答学习疑问
<img src="public\6.png" alt="期末作业主页" width="800">

- 🔍 **智能搜索**: 支持练习内容的分类筛选和关键词搜索
- 📱 **响应式设计**: 完美适配桌面端和移动端设备

## 🚀 技术栈

### 前端技术
- **Next.js 15** - React全栈框架 (App Router)
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **ESLint** - 代码质量检查工具

### API集成
- **WakaTime API** - 编码时长统计服务
- **QAnything API** - 大语言模型问答服务
- **Server-Sent Events** - 实时流式数据传输

### 开发工具
- **Git** - 版本控制
- **npm** - 包管理器
- **Prettier** - 代码格式化

## 🛠️ 安装与运行

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repository-url>
   cd course-showcase
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境变量配置**

   复制环境变量模板文件：
   ```bash
   cp .env.example .env.local
   ```

   编辑 `.env.local` 文件，填入您的API密钥：
   ```env
   # WakaTime API Configuration
   WAKATIME_API_KEY=your_wakatime_api_key_here

   # QAnything API Configuration
   QANYTHING_API_KEY=your_qanything_api_key_here
   QANYTHING_API_BASE_URL=https://openapi.youdao.com/q_anything/api

   # Next.js Configuration
   NEXT_PUBLIC_APP_NAME=Course Showcase
   NEXT_PUBLIC_APP_DESCRIPTION=个人课程练习展示与AI问答平台
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**

   打开浏览器访问 [(http://localhost:3100/chat)](http://localhost:3100/chat)

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🔧 API密钥获取

### WakaTime API Key

1. 访问 [WakaTime官网](https://wakatime.com)
2. 注册并登录账户
3. 前往 [API Key页面](https://wakatime.com/api-key)
4. 复制您的API密钥

### QAnything API Key

1. 访问 [QAnything平台](https://ai.youdao.com/qanything/)
2. 注册并登录账户
3. 在个人中心获取API密钥
4. 复制您的API密钥

## 📁 项目结构

```
course-showcase/
├── src/
│   ├── app/                    # Next.js App Router页面
│   │   ├── api/               # API路由
│   │   ├── exercises/         # 练习展示页面
│   │   ├── chat/              # AI问答页面
│   │   ├── about/             # 关于页面
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   │   ├── Navigation.tsx     # 导航组件
│   │   ├── WakaTimeFooter.tsx # WakaTime页脚
│   │   ├── ChatInterface.tsx  # 聊天界面
│   │   ├── ExerciseCard.tsx   # 练习卡片
│   │   ├── ExerciseList.tsx   # 练习列表
│   │   └── ExerciseTemplate.tsx # 练习模板
│   ├── services/              # API服务
│   │   ├── wakatime.ts        # WakaTime服务
│   │   └── qanything.ts       # QAnything服务
│   ├── lib/                   # 工具库
│   │   ├── api.ts             # API请求工具
│   │   ├── constants.ts       # 常量定义
│   │   └── utils.ts           # 通用工具函数
│   ├── types/                 # TypeScript类型定义
│   │   └── index.ts
│   └── data/                  # 数据文件
│       └── exercises.ts       # 练习数据
├── public/                    # 静态资源
├── .env.local                 # 环境变量 (需要创建)
├── .env.example              # 环境变量模板
├── package.json              # 项目配置
├── tailwind.config.ts        # Tailwind配置
├── tsconfig.json             # TypeScript配置
└── README.md                 # 项目文档
```

## 🎯 QAnything集成路径与实现细节

### 选择的集成路径

本项目选择了 **进阶路径（API自行开发）**，通过直接调用QAnything的API接口，独立开发前端的提问与答案展示界面。

### 实现细节

#### 1. API集成架构

- **服务端API路由**: 使用Next.js API Routes创建代理接口，避免在客户端暴露API密钥
- **流式响应处理**: 实现Server-Sent Events (SSE)，支持实时流式输出
- **错误处理机制**: 完善的错误捕获和用户友好的错误提示
- **类型安全**: 使用TypeScript定义完整的API请求和响应类型

#### 2. 前端交互功能

- **实时聊天界面**: 仿ChatGPT的对话界面，支持多轮对话
- **流式文本显示**: 逐字显示AI回答，提供良好的用户体验
- **历史记录管理**: 自动维护对话历史，支持上下文理解
- **加载状态指示**: 清晰的加载动画和状态提示
- **错误恢复机制**: 网络错误时的重试和降级处理

#### 3. 安全性考虑

- **API密钥保护**: 所有敏感信息存储在服务端环境变量中
- **请求验证**: 对用户输入进行验证和清理
- **速率限制**: 防止API滥用的保护机制

#### 4. 演示模式

由于QAnything API需要知识库配置，项目实现了演示模式：
- 智能响应生成：根据问题关键词提供相关的技术回答
- 流式效果模拟：完整模拟真实API的流式响应体验
- 无缝切换：可轻松切换到真实API调用

## ⏱️ WakaTime API集成方法

### 集成方式

1. **API密钥管理**: 使用环境变量安全存储WakaTime API密钥
2. **服务端代理**: 通过Next.js API Routes代理请求，保护API密钥
3. **数据获取**: 支持多种数据类型获取：
   - 总编码时长统计
   - 今日编码活动
   - 历史统计数据
   - 编程语言分布

### 展示功能

- **页脚全局展示**: 在每个页面底部显示编码统计信息
- **实时更新**: 自动获取最新的编码时长数据
- **美观展示**: 使用图表和卡片形式展示统计信息
- **错误处理**: 网络异常时的友好提示

## 🏗️ Next.js项目结构

### App Router架构

项目采用Next.js 13+的App Router架构，具有以下特点：

- **文件系统路由**: 基于文件结构自动生成路由
- **布局系统**: 嵌套布局支持，提供一致的页面结构
- **服务端组件**: 默认服务端渲染，提升性能
- **API路由**: 内置API支持，无需额外后端服务

### 组件化开发

- **可复用组件**: 高度模块化的组件设计
- **类型安全**: 完整的TypeScript类型定义
- **样式系统**: 基于Tailwind CSS的实用优先样式
- **响应式设计**: 移动端优先的响应式布局

### 数据管理

- **静态数据**: 练习数据使用TypeScript模块管理
- **API状态**: 使用React Hooks管理API调用状态
- **本地存储**: 支持聊天历史等数据的本地持久化

## 📚 旧作业整合方式

### 整合策略

1. **数据结构化**: 将所有练习整理为统一的数据结构
2. **分类管理**: 按技术栈分类组织练习内容
3. **路由设计**: 为每个练习创建独立的展示页面
4. **模板系统**: 使用统一的模板展示不同类型的练习

### 练习展示

- **卡片式布局**: 美观的练习卡片展示
- **搜索筛选**: 支持关键词搜索和分类筛选
- **详情页面**: 每个练习都有详细的说明和代码示例
- **导航系统**: 便捷的练习间导航

## 🚀 项目运行指南

### 开发环境运行

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问应用**
   - 主页: http://localhost:3000
   - 练习展示: http://localhost:3000/exercises
   - AI问答: http://localhost:3000/chat
   - 关于页面: http://localhost:3000/about

3. **API测试**
   - WakaTime API: http://localhost:3000/api/wakatime?type=all_time
   - QAnything API: http://localhost:3000/api/qanything/test

### 生产环境部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm start
   ```

3. **环境变量配置**
   确保生产环境中正确配置所有必需的环境变量。

### 故障排除

#### 常见问题

1. **WakaTime API无响应**
   - 检查API密钥是否正确
   - 确认网络连接正常
   - 查看控制台错误信息

2. **QAnything API错误**
   - 验证API密钥有效性
   - 检查知识库配置（如使用真实API）
   - 当前为演示模式，提供模拟响应

3. **页面样式异常**
   - 确认Tailwind CSS正确加载
   - 检查浏览器兼容性
   - 清除浏览器缓存

## 📸 运行截图

### 1. QAnything运行截图

![QAnything AI问答界面](./screenshots/qanything-demo.png)

*展示了基于QAnything API的智能问答界面，支持实时流式回答和多轮对话*

### 2. WakaTime API集成与展示截图

![WakaTime编码统计](./screenshots/wakatime-stats.png)

*页脚展示的WakaTime编码时长统计，包含总时长、日均时长等关键指标*

### 3. Next.js组织课程练习作业的运行截图

![课程练习导航页](./screenshots/exercises-overview.png)

*课程练习主页，展示了所有练习的分类和统计信息*

![具体练习运行界面](./screenshots/exercise-detail.png)

*HTML基础结构练习的详细页面，包含学习目标、代码示例和实际演示*

## 🔧 技术特色

### 高内聚低耦合设计

- **统一的API工具**: 封装了通用的HTTP请求处理
- **一致的响应格式**: 标准化的API响应结构
- **可复用组件**: 高度模块化的UI组件
- **类型安全**: 完整的TypeScript类型系统

### 现代化开发体验

- **热重载**: 开发时的实时更新
- **代码分割**: 自动的代码分割和懒加载
- **SEO优化**: 服务端渲染和元数据管理
- **性能优化**: 图片优化、字体优化等

## 📄 许可证

本项目仅用于学习和展示目的。

## 🤝 贡献

欢迎提出建议和改进意见！

---

**Course Showcase** - 让学习过程可视化，让技术成长有迹可循。
