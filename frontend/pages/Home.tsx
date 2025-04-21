
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticlePreview from "../components/ArticlePreview";

const Home = () => {
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [topStories, setTopStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch("https://qdedlkgysrlyrhtvtyey.supabase.co/rest/v1/categories?order=display_order.asc,name.asc&select=name,slug", {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWRsa2d5c3JseXJodHZ0eWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTY5MTUsImV4cCI6MjA2MDE5MjkxNX0.kHR_14KdxzDs6Mj6WPGw7ZvTXAmrDXNWRxc7N5fkXg8",
      },
    })
      .then((r) => r.json())
      .then(setCategories);

    // Fetch articles
    fetch(
      `https://qdedlkgysrlyrhtvtyey.supabase.co/rest/v1/articles?select=*,categories(name,slug)&status=eq.published&order=published_at.desc&limit=12`,
      {
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWRsa2d5c3JseXJodHZ0eWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTY5MTUsImV4cCI6MjA2MDE5MjkxNX0.kHR_14KdxzDs6Mj6WPGw7ZvTXAmrDXNWRxc7N5fkXg8",
        },
      }
    )
      .then((r) => r.json())
      .then((articles) => {
        setLatest(articles.slice(0, 6));
        setFeatured(articles.filter((a: any) => a.is_featured).slice(0, 4));
        setTopStories(articles.filter((a: any) => a.is_top_story).slice(0, 4));
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#1A1F2C] to-[#F1F1F1] dark:from-[#19172b] dark:to-[#1A1F2C]">
      <Header categories={categories} />
      <main className="container mx-auto px-4 pt-10 pb-24">
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gradient-primary">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-7 xl:grid-cols-4 mt-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200/70 dark:bg-[#28243a] rounded animate-pulse"></div>
              ))
              : latest.map((article) => (
                <ArticlePreview key={article.id} article={article} />
              ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5 text-[#8B5CF6]">Featured Articles</h2>
          <div className="grid md:grid-cols-4 gap-7">
            {featured.length === 0
              ? <div className="col-span-4 text-gray-600 dark:text-gray-200 text-xl">No featured articles.</div>
              : featured.map((article) => (
                <ArticlePreview key={article.id} article={article} />
              ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-5 text-[#F97316]">Top Stories</h2>
          <div className="grid md:grid-cols-4 gap-7">
            {topStories.length === 0
              ? <div className="col-span-4 text-gray-600 dark:text-gray-200 text-xl">No top stories yet.</div>
              : topStories.map((article) => (
                <ArticlePreview key={article.id} article={article} />
              ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5 text-[#1EAEDB]">Explore Categories</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/#category-${category.slug}`}
                className="px-6 py-3 bg-[#8B5CF6]/90 text-white rounded-2xl font-medium hover:bg-[#1EAEDB]/80 transition text-lg mb-2"
              >
                {category.name}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
