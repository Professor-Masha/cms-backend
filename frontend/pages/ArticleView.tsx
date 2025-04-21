
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase, trackArticleView, addBookmark, removeBookmark } from "../lib/supabaseClient";
import { useToast } from "../hooks/useToast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookmarkIcon, Clock, Calendar, Share2, CheckCircleIcon } from "lucide-react";

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get device type for analytics
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      // Fetch article
      const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (article) {
        setArticle(article);

        // Fetch blocks for this article
        const { data: blocks } = await supabase
          .from('blocks')
          .select('*')
          .eq('article_id', article.id)
          .order('order', { ascending: true });

        if (blocks) {
          setBlocks(blocks);
        }

        // Fetch categories
        const { data: categories } = await supabase
          .from('categories')
          .select(`
            *,
            article_categories!inner(*)
          `)
          .eq('article_categories.article_id', article.id);

        if (categories) {
          setCategories(categories);
        }

        // Track view
        trackArticleView(
          article.id,
          null, // time spent will be tracked on unmount
          getDeviceType(),
          document.referrer
        );

        // Check if article is bookmarked
        if (user) {
          const { data: bookmark } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('user_id', user.id)
            .eq('article_id', article.id)
            .single();
            
          setIsBookmarked(!!bookmark);
        }
      }

      setIsLoading(false);
    };

    fetchArticle();

    // Track time spent when component unmounts
    return () => {
      if (article) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000); // time in seconds
        trackArticleView(
          article.id,
          timeSpent,
          getDeviceType(),
          document.referrer
        );
      }
    };
  }, [slug, user, startTime]);

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(article.id);
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        });
      } else {
        await addBookmark(article.id);
        setIsBookmarked(true);
        toast({
          title: "Bookmarked!",
          description: "Article saved to your bookmarks",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
        <Header categories={[]} />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-white/20 dark:bg-white/10 rounded-lg p-8">
              <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
              <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
        <Header categories={[]} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] text-white rounded-lg font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'text':
      case 'paragraph':
        return (
          <div className="prose dark:prose-invert prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: block.data.content || block.data.text }} 
          />
        );
      case 'heading':
        const HeadingTag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag className="font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {block.data.text}
          </HeadingTag>
        );
      case 'image':
        return (
          <figure className="my-8">
            <img
              src={block.data.url || block.data.src}
              alt={block.data.caption || 'Article image'}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {block.data.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-[#8B5CF6] pl-4 my-6 italic text-gray-700 dark:text-gray-300">
            {block.data.text}
            {block.data.caption && (
              <cite className="block mt-2 text-sm not-italic text-gray-500 dark:text-gray-400">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag className={`my-6 pl-6 ${ListTag === 'ul' ? 'list-disc' : 'list-decimal'} text-gray-700 dark:text-gray-300`}>
            {block.data.items.map((item: string, idx: number) => (
              <li key={idx} className="mb-2">{item}</li>
            ))}
          </ListTag>
        );
      default:
        return <div className="my-4 text-gray-600 dark:text-gray-400">[Unsupported block type: {block.type}]</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
      <Header categories={[]} />
      
      <main className="container mx-auto px-4 py-10">
        <article className="max-w-4xl mx-auto bg-white dark:bg-[#19172b] rounded-2xl shadow-xl overflow-hidden">
          {article.featured_image && (
            <div className="relative h-80 md:h-96">
              <img 
                src={article.featured_image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Link 
                  key={category.id}
                  to={`/?category=${category.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#1EAEDB] bg-[#1EAEDB]/10 px-3 py-1 rounded-full"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mb-8 gap-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(article.published_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {blocks.length * 1.5} min read
              </div>
            </div>
            
            <div className="prose dark:prose-invert prose-lg max-w-none">
              {article.description && (
                <p className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">
                  {article.description}
                </p>
              )}
              
              {blocks.map(block => (
                <div key={block.id} className="mb-6">
                  {renderBlock(block)}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBookmark}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {isBookmarked ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5" />
                      <span>Bookmark</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={shareArticle}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
              
              <Link
                to="/"
                className="text-[#8B5CF6] hover:underline"
              >
                Back to Articles
              </Link>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
