import { Metadata } from 'next';
import { getAllCategories } from '@/data/exercises';
import { EXERCISE_CATEGORIES } from '@/lib/constants';
import ExerciseList from '@/components/ExerciseList';
import fs from 'fs';
import path from 'path';
import { CourseExercise } from '@/types';

export const metadata: Metadata = {
  title: 'HTML练习展示 - Course Showcase',
  description: '浏览所有HTML练习文件，展示学习过程中完成的HTML、CSS和JavaScript案例。',
};

// 从HTML文件中提取标题信息
function extractHTMLInfo(filePath: string): { title: string; description: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 提取标题
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath);
    
    // 提取第一个段落作为描述
    const descriptionMatch = content.match(/<p>(.*?)<\/p>/i);
    const description = descriptionMatch 
      ? descriptionMatch[1].length > 150 
          ? descriptionMatch[1].substring(0, 147) + '...' 
          : descriptionMatch[1]
      : '这是一个HTML练习文件';
    
    return { title, description };
  } catch (error) {
    console.error(`提取文件${filePath}信息时出错:`, error);
    return { 
      title: path.basename(filePath), 
      description: '无法读取文件描述' 
    };
  }
}

// 获取文件修改时间
function getFileModifiedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

// 根据文件名确定类别
function getCategoryFromFilename(filename: string): string {
  if (filename.includes('css')) return 'CSS';
  if (filename.includes('async')) return 'JavaScript';
  
  // 根据文件名中的数字前缀来确定类别
  const prefix = filename.split('-')[0];
  switch (prefix) {
    case '03': return 'HTML';
    case '04': return 'HTML';
    case '05': return 'CSS';
    case '06': return 'JavaScript';
    case '07': return 'JavaScript';
    default: return 'HTML';
  }
}

export default async function ExercisesPage() {
  // 直接获取works文件夹下的HTML文件
  const worksDir = path.join(process.cwd(), 'public', 'works');
  const files = fs.readdirSync(worksDir);
  
  const htmlFiles = files.filter(file => 
    file.endsWith('.html') && file !== 'index.html'
  );
  
  const exercises: CourseExercise[] = htmlFiles.map(file => {
    const filePath = path.join(worksDir, file);
    const { title, description } = extractHTMLInfo(filePath);
    const category = getCategoryFromFilename(file);
    const modifiedDate = getFileModifiedDate(filePath);
    
    return {
      id: file.replace('.html', ''),
      title,
      description,
      category,
      technologies: [category],
      path: `/works/${file}`,
      createdAt: modifiedDate,
      updatedAt: modifiedDate
    };
  });
  
  // 添加索引页面
  const indexFilePath = path.join(worksDir, 'index.html');
  if (fs.existsSync(indexFilePath)) {
    const { title, description } = extractHTMLInfo(indexFilePath);
    const modifiedDate = getFileModifiedDate(indexFilePath);
    
    exercises.push({
      id: 'index',
      title,
      description,
      category: 'HTML',
      technologies: ['HTML'],
      path: '/works/index.html',
      createdAt: modifiedDate,
      updatedAt: modifiedDate
    });
  }

  const categories = getAllCategories();

  // 统计信息
  const totalExercises = exercises.length;
  const categoryStats = categories.map(category => ({
    name: category,
    count: exercises.filter(exercise => exercise.category === category).length,
    info: EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              HTML练习文件展示
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              这里展示了我在学习过程中完成的所有HTML文件，包含了HTML、CSS和JavaScript的练习案例。
              每个文件都可以点击查看详情。
            </p>
            
            {/* 统计信息 */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-blue-50 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-blue-600">{totalExercises}</div>
                <div className="text-sm text-blue-800">总文件数</div>
              </div>
              
              {categoryStats.map((category) => (
                <div 
                  key={category.name}
                  className="rounded-lg px-4 py-2"
                  style={{ backgroundColor: `${category.info?.color || '#6B7280'}15` }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: category.info?.color || '#6B7280' }}
                  >
                    {category.count}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: category.info?.color || '#6B7280' }}
                  >
                    {category.info?.name || category.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 练习列表 */}
      <div className="container mx-auto px-4 py-8">
        <ExerciseList exercises={exercises} />
      </div>
    </div>
  );
}
