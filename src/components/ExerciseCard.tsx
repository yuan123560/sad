import Link from 'next/link';
import { CourseExercise } from '@/types';
import { EXERCISE_CATEGORIES } from '@/lib/constants';
import { formatDate, formatRelativeTime } from '@/lib/utils'; // 添加formatDate导入

interface ExerciseCardProps {
  exercise: CourseExercise;
  className?: string;
}

export default function ExerciseCard({ exercise, className = '' }: ExerciseCardProps) {
  const categoryInfo = EXERCISE_CATEGORIES[exercise.category as keyof typeof EXERCISE_CATEGORIES];
  
  // 判断是否是外部HTML文件链接
  const isExternalLink = exercise.path.startsWith('/works/');

  return (
    <div className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden group">
        {/* 头部 */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryInfo?.color || '#6B7280' }}
              ></div>
              <span 
                className="text-sm font-medium px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${categoryInfo?.color || '#6B7280'}20`,
                  color: categoryInfo?.color || '#6B7280'
                }}
              >
                {exercise.category}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(exercise.updatedAt)} {/* 确保使用formatDate而非formatRelativeTime */}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {exercise.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {exercise.description}
          </p>

          {/* 技术标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>创建于 {formatRelativeTime(exercise.createdAt)}</span>
            </div>
            
            {isExternalLink ? (
              <a 
                href={exercise.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                <span>在新窗口打开</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <Link 
                href={exercise.path} 
                className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700"
              >
                <span>查看详情</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
