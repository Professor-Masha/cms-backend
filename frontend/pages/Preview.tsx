
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabaseClient";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePreview } from "../components/PreviewProvider";
import { CopyIcon, ExternalLinkIcon, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const Preview = () => {
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const { toast } = useToast();
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();
  const { enablePreview, disablePreview, isPreviewMode } = usePreview();

  // Get slug and secret from URL parameters
  const slug = searchParams.get('slug');
  const secret = searchParams.get('secret');
  const draftMode = searchParams.get('draft') === 'true';
  const articleId = searchParams.get('articleId');

  // Load draft articles
  useEffect(() => {
    const fetchDraftArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, slug, status, updated_at")
          .eq("status", "draft")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching draft articles:", error);
        toast({
          title: "Failed to load draft articles",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchDraftArticles();
  }, [toast]);

  // Check if we need to enable preview from URL params
  useEffect(() => {
    if (draftMode && slug && secret && articleId) {
      validateAndEnablePreview(slug, secret, articleId);
    }
  }, [slug, secret, draftMode, articleId]);

  const validateAndEnablePreview = async (slug, secret, articleId) => {
    setLoading(true);
    try {
      // In a real implementation, this should validate against a secure secret
      const PREVIEW_SECRET = "infostream_preview_secret"; // This would be stored securely
      
      if (secret !== PREVIEW_SECRET) {
        toast({
          title: "Invalid preview token",
          description: "You don't have permission to preview this content.",
          variant: "destructive",
        });
        return;
      }

      // Get the article data by slug
      const { data: article, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        throw error;
      }

      if (!article) {
        toast({
          title: "Article not found",
          description: `No article found with slug: ${slug}`,
          variant: "destructive",
        });
        return;
      }

      // Enable preview mode
      enablePreview(articleId || article.id);
      setArticleData(article);
      
      toast({
        title: "Preview mode enabled",
        description: `Now previewing: ${article.title}`,
      });

      // Navigate to article view with draft mode enabled
      navigate(`/article/${slug}?draft=true&articleId=${articleId || article.id}`);
    } catch (error) {
      console.error("Preview error:", error);
      toast({
        title: "Preview error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartPreview = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const slug = formData.get('slug');
    const secret = formData.get('secret');
    
    if (!slug || !secret) {
      toast({
        title: "Missing information",
        description: "Please provide both slug and secret token",
        variant: "destructive",
      });
      return;
    }

    await validateAndEnablePreview(slug, secret, null);
  };

  const handleExitPreview = () => {
    disablePreview();
    toast({
      title: "Preview mode disabled",
      description: "You've exited preview mode.",
    });
    navigate('/');
  };

  const generatePreviewLink = (article) => {
    const PREVIEW_SECRET = "infostream_preview_secret";
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview?slug=${article.slug}&secret=${PREVIEW_SECRET}&draft=true&articleId=${article.id}`;
  };

  const handleCopyLink = (article) => {
    const previewLink = generatePreviewLink(article);
    navigator.clipboard.writeText(previewLink);
    setCopied(true);
    setCopiedId(article.id);
    
    toast({
      title: "Link copied",
      description: "Preview link copied to clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
      setCopiedId("");
    }, 3000);
  };

  const handleOpenPreview = (article) => {
    const previewLink = generatePreviewLink(article);
    window.open(previewLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1EAEDB]/30 to-[#8B5CF6]/30 dark:from-[#1EAEDB]/10 dark:to-[#8B5CF6]/10 py-10 px-4">
      <div className="max-w-4xl mx-auto pt-12">
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#1A1F2C]/90">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-2xl">
              Info Stream Africa Preview Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="articles">
              <TabsList className="mb-6">
                <TabsTrigger value="articles">Draft Articles</TabsTrigger>
                <TabsTrigger value="manual">Manual Preview</TabsTrigger>
                {isPreviewMode && <TabsTrigger value="active">Active Preview</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="articles">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Available Draft Articles</h2>
                  {articles.length === 0 ? (
                    <p className="text-muted-foreground">No draft articles available</p>
                  ) : (
                    <div className="space-y-3">
                      {articles.map((article) => (
                        <div key={article.id} className="border p-4 rounded-md flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <p className="text-sm text-muted-foreground">Last updated: {new Date(article.updated_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCopyLink(article)}
                            >
                              {copied && copiedId === article.id ? <CheckCircle size={16} /> : <CopyIcon size={16} />}
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleOpenPreview(article)}
                            >
                              <ExternalLinkIcon size={16} className="mr-1" /> Preview
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="manual">
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">Enter preview mode</h3>
                    <p className="text-blue-600 dark:text-blue-400 mt-1 text-sm">
                      Preview mode allows you to view draft articles before they are published.
                    </p>
                  </div>

                  <form onSubmit={handleStartPreview} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="slug" className="text-sm font-medium">
                        Article Slug
                      </label>
                      <Input 
                        id="slug"
                        name="slug"
                        placeholder="article-slug"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="secret" className="text-sm font-medium">
                        Preview Secret
                      </label>
                      <Input 
                        id="secret"
                        name="secret"
                        type="password"
                        placeholder="Enter secret token"
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Validating..." : "Start Preview"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              {isPreviewMode && (
                <TabsContent value="active">
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-md">
                      <h3 className="font-medium text-green-800 dark:text-green-300">Preview mode is active</h3>
                      <p className="text-green-600 dark:text-green-400 mt-1 text-sm">
                        You're currently previewing content in draft mode.
                      </p>
                    </div>
                    
                    <Button onClick={handleExitPreview} variant="outline">
                      Exit Preview Mode
                    </Button>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;
