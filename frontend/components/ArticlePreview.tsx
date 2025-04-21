
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { addBookmark, removeBookmark } from "../lib/supabaseClient";
import { BookmarkIcon, CheckCircleIcon } from "lucide-react";
import { useToast } from "../hooks/useToast";

const ArticlePreview = ({ article, isBookmarked = false }: { article: any, isBookmarked?: boolean }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);

  const categoryName = article.categories?.[0]?.categories?.name || "General";

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }

    try {
      if (bookmarked) {
        await removeBookmark(article.id);
        setBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        });
      } else {
        await addBookmark(article.id);
        setBookmarked(true);
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

  return (
    <Link 
      to={`/article/${article.slug}`}
      className="rounded-2xl overflow-hidden shadow-md bg-white dark:bg-[#19172b] hover:shadow-xl transition border border-transparent hover:border-[#1EAEDB]/40 block"
    >
      {article.featured_image && (
        <div className="relative">
          <img src={article.featured_image} alt={article.title} className="w-full h-44 object-cover" />
          {user && (
            <button 
              onClick={handleBookmark}
              className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-[#19172b]/80 rounded-full hover:bg-white dark:hover:bg-[#19172b] transition"
            >
              {bookmarked ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xs text-[#1EAEDB] font-bold uppercase tracking-wider">
          {categoryName}
        </div>
        <h3 className="text-xl font-semibold">{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{article.description}</p>
        <div className="mt-2 text-xs text-gray-400">{new Date(article.published_at).toLocaleString()}</div>
      </div>
    </Link>
  );
};

export default ArticlePreview;
