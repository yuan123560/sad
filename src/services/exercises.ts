import { CourseExercise } from '@/types';

/**
 * 获取所有HTML练习文件
 * @returns Promise<CourseExercise[]>
 */
export async function getHtmlExercises(): Promise<CourseExercise[]> {
  try {
    // 使用绝对URL，确保在服务器端渲染时也能正常工作
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3100';
    const response = await fetch(`${baseUrl}/api/exercises`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('获取exercises失败');
    }

    const data = await response.json();
    return data.exercises as CourseExercise[];
  } catch (error) {
    console.error('获取exercises时出错:', error);
    return [];
  }
} 