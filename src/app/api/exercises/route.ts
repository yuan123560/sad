import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CourseExercise } from '@/types';

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

export async function GET() {
  try {
    const worksDir = path.join(process.cwd(), 'works');
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
    
    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('获取exercises时出错:', error);
    return NextResponse.json(
      { error: '获取exercises失败' },
      { status: 500 }
    );
  }
} 