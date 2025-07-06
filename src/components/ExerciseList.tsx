'use client';

import { useState, useMemo } from 'react';
import { CourseExercise } from '@/types';
import { EXERCISE_CATEGORIES } from '@/lib/constants';
import ExerciseCard from './ExerciseCard';
import { searchExercises } from '@/data/exercises';

interface ExerciseListProps {
  exercises: CourseExercise[];
  className?: string;
}

export default function ExerciseList({ exercises, className = '' }: ExerciseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 过滤和排序练习
  const filteredAndSortedExercises = useMemo(() => {
    let filtered = exercises;

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      filtered = searchExercises(searchQuery).filter(exercise =>
        selectedCategory === 'all' || exercise.category === selectedCategory
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'date':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [exercises, selectedCategory, searchQuery, sortBy, sortOrder]);

  // 获取分类统计
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: exercises.length };
    
    Object.keys(EXERCISE_CATEGORIES).forEach(category => {
      stats[category] = exercises.filter(exercise => exercise.category === category).length;
    });
    
    return stats;
  }, [exercises]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索练习..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 排序选择 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">排序:</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">最新更新</option>
              <option value="date-asc">最早更新</option>
              <option value="title-asc">标题 A-Z</option>
              <option value="title-desc">标题 Z-A</option>
              <option value="category-asc">分类 A-Z</option>
              <option value="category-desc">分类 Z-A</option>
            </select>
          </div>
        </div>

        {/* 分类过滤器 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({categoryStats.all})
            </button>
            
            {Object.entries(EXERCISE_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'text-white'
                    : 'text-gray-700 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: selectedCategory === key ? category.color : `${category.color}20`,
                  color: selectedCategory === key ? 'white' : category.color,
                }}
              >
                {category.name} ({categoryStats[key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          找到 <span className="font-medium">{filteredAndSortedExercises.length}</span> 个练习
          {searchQuery && (
            <span>
              ，搜索关键词: <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </span>
          )}
        </p>
        
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            清除搜索
          </button>
        )}
      </div>

      {/* 练习列表 */}
      {filteredAndSortedExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到练习</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? '尝试调整搜索关键词或选择不同的分类' : '当前分类下暂无练习'}
          </p>
        </div>
      )}
    </div>
  );
}
