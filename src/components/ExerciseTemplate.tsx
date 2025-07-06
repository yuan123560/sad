import Link from 'next/link';
import { CourseExercise } from '@/types';
import { EXERCISE_CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface ExerciseTemplateProps {
  exercise: CourseExercise;
  children: React.ReactNode;
  className?: string;
}

export default function ExerciseTemplate({ 
  exercise, 
  children, 
  className = '' 
}: ExerciseTemplateProps) {
  const categoryInfo = EXERCISE_CATEGORIES[exercise.category as keyof typeof EXERCISE_CATEGORIES];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              首页
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/exercises" className="text-blue-600 hover:text-blue-800">
              课程练习
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600">{exercise.title}</span>
          </nav>
        </div>
      </div>

      {/* 练习头部信息 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 分类标签 */}
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryInfo?.color || '#6B7280' }}
              ></div>
              <span 
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${categoryInfo?.color || '#6B7280'}20`,
                  color: categoryInfo?.color || '#6B7280'
                }}
              >
                {exercise.category}
              </span>
            </div>

            {/* 标题和描述 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {exercise.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {exercise.description}
            </p>

            {/* 技术标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {exercise.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>创建时间: {formatDate(exercise.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>更新时间: {formatDate(exercise.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 练习内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/exercises"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回练习列表
          </Link>
        </div>
      </div>
    </div>
  );
}
