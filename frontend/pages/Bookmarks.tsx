
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBookmarks } from "../lib/supabaseClient";
import { useToast } from "../hooks/useToast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticlePreview from "../components/ArticlePreview";

const Bookmarks = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user && !authLoading) {
        navigate("/auth");
        return;
      }

      if (user) {
        try {
          const { data, error } = await getBookmarks();
          
          if (error) throw error;
          
          setBookmarks(data || []);
        } catch (error: any) {
          toast({
            title: "Error fetching bookmarks",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookmarks();
  }, [user, authLoading, navigate, toast]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
        <Header categories={[]} />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Bookmarks</h1>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-white/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
      <Header categories={[]} />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Bookmarks</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Articles you've saved for later</p>
          
          {bookmarks.length === 0 ? (
            <div className="bg-white dark:bg-[#19172b] rounded-2xl shadow-xl p-10 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">No bookmarks yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                When you find articles you'd like to save for later, click the bookmark icon to add them here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] text-white rounded-lg font-medium hover:from-[#1EAEDB]/90 hover:to-[#8B5CF6]/90 transition"
              >
                Browse Articles
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <ArticlePreview 
                  key={bookmark.id} 
                  article={bookmark.articles} 
                  isBookmarked={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bookmarks;
