export default function getRandomHexColor() {
  return (
    <div>
      <h1 className="text-rose-700">Home</h1>
      <p className="text-stone-800">welcome to my homepage!</p>
    </div>

  );
}// src/components/ExerciseCard.js (初始版本 - 仅依赖 Props)
// (这是您提供的 ExerciseCard.js 的核心结构)
import React from "react";

export default function ExerciseCard({
  title,
  description,
  imageUrl,
  link,
  tags,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <img
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={title || "Exercise Image"}
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {title || "练习标题"}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description || "这里是练习的简要描述，介绍练习的主要内容和目标。"}
        </p>
        {/* ... 其他 props 相关的渲染 ... */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-rose-600 text-white px-6 py-2 rounded-md font-medium
                       transform transition-transform duration-200 hover:scale-105 hover:bg-rose-700
                       focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
          >
            查看练习
          </a>
        )}
      </div>
    </div>
  );
}