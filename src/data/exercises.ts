import { CourseExercise } from '@/types';
import { EXERCISE_CATEGORIES } from '@/lib/constants';

// 课程练习数据
export const courseExercises: CourseExercise[] = [
  // HTML 基础练习
  {
    id: 'html-basic-structure',
    title: 'HTML 基础结构',
    description: '学习 HTML 文档的基本结构，包括 DOCTYPE、html、head、body 等标签的使用。',
    category: 'HTML',
    technologies: ['HTML5'],
    path: '/exercises/html/basic-structure',
    createdAt: new Date('2025-06-28'), // 修改为6月28日
    updatedAt: new Date('2025-06-28'), // 修改为6月28日
  },
  {
    id: 'html-forms',
    title: 'HTML 表单设计',
    description: '掌握各种表单元素的使用，包括 input、select、textarea 等，以及表单验证。',
    category: 'HTML',
    technologies: ['HTML5', 'Form Validation'],
    path: '/exercises/html/forms',
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-05'),
  },
  {
    id: 'html-semantic',
    title: '语义化 HTML',
    description: '学习使用语义化标签如 header、nav、main、article、section、footer 等。',
    category: 'HTML',
    technologies: ['HTML5', 'Semantic HTML'],
    path: '/exercises/html/semantic',
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10'),
  },

  // CSS 样式练习
  {
    id: 'css-selectors',
    title: 'CSS练习',
    description: '掌握各种 CSS 选择器的使用，包括基础选择器、组合选择器、伪类和伪元素。',
    category: 'CSS',
    technologies: ['CSS3'],
    path: '/exercises/css/selectors',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: 'css-flexbox',
    title: 'Flexbox 布局',
    description: '学习 Flexbox 弹性盒子布局，掌握 flex 容器和 flex 项目的属性。',
    category: 'CSS',
    technologies: ['CSS3', 'Flexbox'],
    path: '/exercises/css/flexbox',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: 'css-grid',
    title: 'CSS Grid 布局',
    description: '掌握 CSS Grid 网格布局系统，创建复杂的二维布局。',
    category: 'CSS',
    technologies: ['CSS3', 'CSS Grid'],
    path: '/exercises/css/grid',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: 'css-animations',
    title: 'CSS 动画效果',
    description: '学习 CSS 过渡和动画，包括 transition、transform、animation 等属性。',
    category: 'CSS',
    technologies: ['CSS3', 'Animations'],
    path: '/exercises/css/animations',
    createdAt: new Date('2025-06-28'), // 确认日期为2025-06-28
    updatedAt: new Date('2025-06-28'), // 确认日期为2025-06-28
  },

  // JavaScript 编程练习
  {
    id: 'js-basics',
    title: 'JavaScript 语法练习', // 修改标题
    description: '学习 JavaScript 基础语法，包括变量、数据类型、运算符、控制结构等。',
    category: 'JavaScript',
    technologies: ['JavaScript', 'ES6+'],
    path: '/exercises/javascript/basics',
    createdAt: new Date('2025-06-28'),
    updatedAt: new Date('2025-06-28'),
  },
  {
    id: 'js-dom-manipulation',
    title: 'DOM 操作',
    description: '掌握 DOM 操作技巧，包括元素选择、属性修改、事件处理等。',
    category: 'JavaScript',
    technologies: ['JavaScript', 'DOM API'],
    path: '/exercises/javascript/dom',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: 'js-async',
    title: '异步编程练习',
    description: '学习 JavaScript 异步编程，包括 Promise、async/await、fetch API 等。',
    category: 'JavaScript',
    technologies: ['JavaScript', 'Async/Await', 'Fetch API'],
    path: '/exercises/javascript/async',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: 'js-modules',
    title: 'ES6 模块系统',
    description: '掌握 ES6 模块的导入导出，理解模块化编程的优势。',
    category: 'JavaScript',
    technologies: ['JavaScript', 'ES6 Modules'],
    path: '/exercises/javascript/modules',
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },

  // React 框架练习
  {
    id: 'react-components',
    title: 'React 组件基础',
    description: '学习 React 函数组件和类组件的创建，理解组件的生命周期。',
    category: 'React',
    technologies: ['React', 'JSX'],
    path: '/exercises/react/components',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
  },
  {
    id: 'react-hooks',
    title: 'React Hooks',
    description: '掌握 React Hooks 的使用，包括 useState、useEffect、useContext 等。',
    category: 'React',
    technologies: ['React', 'React Hooks'],
    path: '/exercises/react/hooks',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: 'react-state-management',
    title: 'React 状态管理',
    description: '学习 React 状态管理，包括本地状态、状态提升、Context API 等。',
    category: 'React',
    technologies: ['React', 'Context API'],
    path: '/exercises/react/state',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: 'react-routing',
    title: 'React 路由',
    description: '掌握 React Router 的使用，实现单页应用的路由管理。',
    category: 'React',
    technologies: ['React', 'React Router'],
    path: '/exercises/react/routing',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
  },

  // Next.js 全栈练习
  {
    id: 'nextjs-pages',
    title: 'Next.js 页面路由',
    description: '学习 Next.js 的文件系统路由，包括动态路由和嵌套路由。',
    category: 'Next.js',
    technologies: ['Next.js', 'React', 'TypeScript'],
    path: '/exercises/nextjs/pages',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: 'nextjs-api-routes',
    title: 'Next.js API 路由',
    description: '掌握 Next.js API 路由的创建，实现后端 API 接口。',
    category: 'Next.js',
    technologies: ['Next.js', 'API Routes', 'TypeScript'],
    path: '/exercises/nextjs/api',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: 'nextjs-ssr-ssg',
    title: 'Next.js 渲染模式',
    description: '学习 Next.js 的 SSR、SSG、ISR 等渲染模式，优化应用性能。',
    category: 'Next.js',
    technologies: ['Next.js', 'SSR', 'SSG', 'ISR'],
    path: '/exercises/nextjs/rendering',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25'),
  },

  // 综合项目
  {
    id: 'project-todo-app',
    title: '待办事项应用',
    description: '使用 React 和 TypeScript 构建一个功能完整的待办事项管理应用。',
    category: '综合项目',
    technologies: ['React', 'TypeScript', 'Local Storage'],
    path: '/exercises/projects/todo-app',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'project-weather-app',
    title: '天气预报应用',
    description: '集成第三方 API，创建一个实时天气预报应用。',
    category: '综合项目',
    technologies: ['React', 'API Integration', 'Responsive Design'],
    path: '/exercises/projects/weather-app',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: 'project-blog-system',
    title: '博客系统',
    description: '使用 Next.js 构建一个完整的博客系统，包括文章管理、评论功能等。',
    category: '综合项目',
    technologies: ['Next.js', 'TypeScript', 'Database', 'Authentication'],
    path: '/exercises/projects/blog-system',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
];

// 获取所有练习
export function getAllExercises(): CourseExercise[] {
  return courseExercises;
}

// 根据分类获取练习
export function getExercisesByCategory(category: string): CourseExercise[] {
  return courseExercises.filter(exercise => exercise.category === category);
}

// 根据ID获取练习
export function getExerciseById(id: string): CourseExercise | undefined {
  return courseExercises.find(exercise => exercise.id === id);
}

// 获取所有分类
export function getAllCategories(): string[] {
  return Object.keys(EXERCISE_CATEGORIES);
}

// 搜索练习
export function searchExercises(query: string): CourseExercise[] {
  const lowercaseQuery = query.toLowerCase();
  return courseExercises.filter(exercise =>
    exercise.title.toLowerCase().includes(lowercaseQuery) ||
    exercise.description.toLowerCase().includes(lowercaseQuery) ||
    exercise.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
}
