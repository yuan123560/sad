import { Metadata } from 'next';
import { getExerciseById } from '@/data/exercises';
import ExerciseTemplate from '@/components/ExerciseTemplate';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'HTML 基础结构 - Course Showcase',
  description: '学习 HTML 文档的基本结构，包括 DOCTYPE、html、head、body 等标签的使用。',
};

export default function HTMLBasicStructurePage() {
  const exercise = getExerciseById('html-basic-structure');
  
  if (!exercise) {
    notFound();
  }

  return (
    <ExerciseTemplate exercise={exercise}>
      <div className="p-6">
        {/* 学习目标 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">学习目标</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>理解 HTML 文档的基本结构</li>
            <li>掌握 DOCTYPE 声明的作用</li>
            <li>学会使用 html、head、body 等基础标签</li>
            <li>了解 meta 标签的重要性</li>
            <li>掌握语义化标签的使用</li>
          </ul>
        </section>

        {/* 代码示例 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">代码示例</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HTML基础结构练习页面">
    <meta name="keywords" content="HTML, 基础, 结构, 学习">
    <meta name="author" content="Course Showcase">
    <title>HTML 基础结构练习</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- 页面头部 -->
    <header>
        <h1>欢迎来到 HTML 基础结构练习</h1>
        <nav>
            <ul>
                <li><a href="#introduction">介绍</a></li>
                <li><a href="#structure">结构</a></li>
                <li><a href="#examples">示例</a></li>
            </ul>
        </nav>
    </header>

    <!-- 主要内容 -->
    <main>
        <section id="introduction">
            <h2>HTML 简介</h2>
            <p>HTML（HyperText Markup Language）是用于创建网页的标准标记语言。</p>
        </section>

        <section id="structure">
            <h2>文档结构</h2>
            <article>
                <h3>基本元素</h3>
                <p>HTML 文档包含以下基本元素：</p>
                <ul>
                    <li>DOCTYPE 声明</li>
                    <li>html 根元素</li>
                    <li>head 头部元素</li>
                    <li>body 主体元素</li>
                </ul>
            </article>
        </section>

        <section id="examples">
            <h2>实际应用</h2>
            <p>这个页面本身就是一个很好的 HTML 结构示例。</p>
        </section>
    </main>

    <!-- 侧边栏 -->
    <aside>
        <h3>相关资源</h3>
        <ul>
            <li><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML">MDN HTML 文档</a></li>
            <li><a href="https://www.w3schools.com/html/">W3Schools HTML 教程</a></li>
        </ul>
    </aside>

    <!-- 页面底部 */
    <footer>
        <p>&copy; 2024 Course Showcase. 保留所有权利。</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`}</code>
            </pre>
          </div>
        </section>

        {/* 实际演示 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">实际演示</h2>
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎来到 HTML 基础结构练习</h1>
              <nav>
                <ul className="flex space-x-4 text-blue-600">
                  <li><a href="#introduction" className="hover:underline">介绍</a></li>
                  <li><a href="#structure" className="hover:underline">结构</a></li>
                  <li><a href="#examples" className="hover:underline">示例</a></li>
                </ul>
              </nav>
            </header>

            <main className="space-y-6">
              <section id="introduction">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">HTML 简介</h2>
                <p className="text-gray-700">HTML（HyperText Markup Language）是用于创建网页的标准标记语言。</p>
              </section>

              <section id="structure">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">文档结构</h2>
                <article>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">基本元素</h3>
                  <p className="text-gray-700 mb-2">HTML 文档包含以下基本元素：</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>DOCTYPE 声明</li>
                    <li>html 根元素</li>
                    <li>head 头部元素</li>
                    <li>body 主体元素</li>
                  </ul>
                </article>
              </section>

              <section id="examples">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">实际应用</h2>
                <p className="text-gray-700">这个页面本身就是一个很好的 HTML 结构示例。</p>
              </section>
            </main>

            <aside className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">相关资源</h3>
              <ul className="space-y-1">
                <li><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML" className="text-blue-600 hover:underline">MDN HTML 文档</a></li>
                <li><a href="https://www.w3schools.com/html/" className="text-blue-600 hover:underline">W3Schools HTML 教程</a></li>
              </ul>
            </aside>

            <footer className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">&copy; 2024 Course Showcase. 保留所有权利。</p>
            </footer>
          </div>
        </section>

        {/* 知识点总结 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">知识点总结</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">DOCTYPE 声明</h3>
              <p className="text-blue-800 text-sm">告诉浏览器使用哪个 HTML 版本来解析文档</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Meta 标签</h3>
              <p className="text-green-800 text-sm">提供页面的元数据信息，如字符编码、视口设置等</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">语义化标签</h3>
              <p className="text-purple-800 text-sm">使用有意义的标签如 header、main、section、article 等</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">文档结构</h3>
              <p className="text-orange-800 text-sm">合理的层次结构有助于 SEO 和可访问性</p>
            </div>
          </div>
        </section>

        {/* 练习任务 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">练习任务</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">任务要求</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800">
              <li>创建一个完整的 HTML 文档，包含所有必要的基础结构</li>
              <li>使用适当的 meta 标签设置字符编码和视口</li>
              <li>添加有意义的标题和描述</li>
              <li>使用语义化标签组织内容</li>
              <li>确保文档通过 HTML 验证器检查</li>
            </ol>
          </div>
        </section>
      </div>
    </ExerciseTemplate>
  );
}
