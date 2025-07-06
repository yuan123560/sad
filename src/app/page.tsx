import Link from 'next/link';
import { getAllExercises, getAllCategories } from '@/data/exercises';
import { EXERCISE_CATEGORIES } from '@/lib/constants';
import ExerciseCard from '@/components/ExerciseCard';

export default function Home() {
  const exercises = getAllExercises();
  const categories = getAllCategories();

  // 获取最新的几个练习
  const recentExercises = exercises
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  // 统计信息
  const totalExercises = 7; // 修改为固定值7
  const categoryStats = categories.map(category => ({
    name: category,
    count: exercises.filter(exercise => exercise.category === category).length,
    info: EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES],
  }));
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-100 to-yellow-300 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#1a365d' }}>
              《Web前端技术》
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#1a365d' }}>
              个人课程练习展示与AI问答平台
            </p>
            <p className="text-lg mb-8 text-orange-400 max-w-2xl mx-auto">
              这里展示了我在学习前端开发过程中完成的所有练习项目，
              集成了WakaTime编码时长统计和QAnything AI问答服务，
              为学习过程提供全方位的记录和支持。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/exercises"
                className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
              >
                浏览练习
              </Link>
              <Link
                href="/chat"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
              >
                AI 问答
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 统计信息 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalExercises}</div>
              <div className="text-gray-600">总练习数</div>
            </div>

            {categoryStats.slice(0, 3).map((category) => (
              <div key={category.name} className="text-center">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: category.info?.color || '#6B7280' }}
                >
                  {category.count}
                </div>
                <div className="text-gray-600">{category.info?.name || category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">平台特色</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              集成多种现代技术，为学习过程提供全方位支持
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">课程练习展示</h3>
              <p className="text-gray-600">
                系统化展示HTML、CSS、JavaScript、React、Next.js等技术栈的学习练习
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">编码时长统计</h3>
              <p className="text-gray-600">
                集成WakaTime API，实时展示编码时长和学习进度统计
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 智能问答</h3>
              <p className="text-gray-600">
                基于QAnything大语言模型，提供智能问答服务，解答学习疑问
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-200 to-yellow-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">开始探索学习之旅</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            浏览所有课程练习，或者与AI助手开始对话，获得学习指导和答疑解惑
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exercises"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              浏览所有练习
            </Link>
            <Link
              href="/chat"
              className="border-2 border-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              开始AI对话
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
