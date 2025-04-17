
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Article, ArticleStatus } from '@/types/cms';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import ArticlesList from '@/components/articles/ArticlesList';
import { FileText, FilePen, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<ArticleStatus | 'all'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching articles:', error);
          toast({
            title: 'Error',
            description: 'Failed to load articles',
            variant: 'destructive',
          });
          return;
        }

        if (data) {
          setArticles(data as Article[]);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  const filteredArticles = activeStatus === 'all' 
    ? articles 
    : articles.filter((article) => article.status === activeStatus);

  const getArticleCountByStatus = (status: ArticleStatus | 'all'): number => {
    if (status === 'all') return articles.length;
    return articles.filter(article => article.status === status).length;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarContent>
            <div className="p-4">
              <h2 className="font-semibold text-xl mb-4">Articles</h2>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeStatus === 'all'}
                    onClick={() => setActiveStatus('all')}
                  >
                    <FileText />
                    <span>All Articles</span>
                    <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                      {getArticleCountByStatus('all')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeStatus === 'published'}
                    onClick={() => setActiveStatus('published')}
                  >
                    <FileText />
                    <span>Published</span>
                    <span className="ml-auto bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      {getArticleCountByStatus('published')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeStatus === 'draft'}
                    onClick={() => setActiveStatus('draft')}
                  >
                    <FilePen />
                    <span>Drafts</span>
                    <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                      {getArticleCountByStatus('draft')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeStatus === 'scheduled'}
                    onClick={() => setActiveStatus('scheduled')}
                  >
                    <Clock />
                    <span>Scheduled</span>
                    <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {getArticleCountByStatus('scheduled')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <div className="mt-6">
                <button 
                  onClick={() => navigate('/articles/new')} 
                  className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create New Article
                </button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {activeStatus === 'all' ? 'All Articles' : 
                 activeStatus === 'published' ? 'Published Articles' : 
                 activeStatus === 'draft' ? 'Draft Articles' : 'Scheduled Articles'}
              </h1>
              <p className="text-muted-foreground">
                {activeStatus === 'all' ? 'Manage all your content' : 
                 activeStatus === 'published' ? 'Articles that are live on your site' : 
                 activeStatus === 'draft' ? 'Articles in progress' : 'Articles scheduled for future publication'}
              </p>
            </div>

            <ArticlesList 
              articles={filteredArticles} 
              isLoading={loading} 
              onEdit={(id) => navigate(`/articles/${id}`)}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ArticlesPage;
