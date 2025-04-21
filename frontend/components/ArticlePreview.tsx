
import React from "react";

const ArticlePreview = ({ article }: { article: any }) => (
  <div
    className="rounded-2xl overflow-hidden shadow-md bg-white dark:bg-[#19172b] hover:shadow-xl transition border border-transparent hover:border-[#1EAEDB]/40"
  >
    {article.featured_image && (
      <img src={article.featured_image} alt={article.title} className="w-full h-44 object-cover" />
    )}
    <div className="p-4 flex flex-col gap-2">
      <div className="text-xs text-[#1EAEDB] font-bold uppercase tracking-wider">
        {article.category_name || article.category || ""}
      </div>
      <h3 className="text-xl font-semibold">{article.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{article.description}</p>
      <div className="mt-2 text-xs text-gray-400">{new Date(article.published_at).toLocaleString()}</div>
    </div>
  </div>
);

export default ArticlePreview;
