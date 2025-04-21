
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticlePreview from "../components/ArticlePreview";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";

const Home = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [topStories, setTopStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('name,slug')
        .order('name', { ascending: true });

      if (data) setCategories(data);
    };

    const fetchArticles = async () => {
      // Get articles with their categories
      const { data: articles } = await supabase
        .from('articles')
        .select(`
          *,
          categories:article_categories(categories(*))
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12);

      if (articles) {
        setLatest(articles.slice(0, 6));
        setFeatured(articles.filter(article => article.is_featured).slice(0, 4));
        setTopStories(articles.filter(article => article.is_top_story).slice(0, 4));
      }
      setLoading(false);
    };

    fetchCategories();
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
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
