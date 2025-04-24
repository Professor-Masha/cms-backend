
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabaseClient";
import { useSearchParams, useNavigate } from "react-router-dom";

const Preview = () => {
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();

  // Get slug and secret from URL parameters
  const slug = searchParams.get('slug');
  const secret = searchParams.get('secret');
  const draftMode = searchParams.get('draft') === 'true';

  useEffect(() => {
    // Check if we have parameters to enable preview mode
    if (slug && secret) {
      validateAndEnablePreview(slug, secret);
    }
  }, [slug, secret]);

  const validateAndEnablePreview = async (slug, secret) => {
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

      // Enable draft mode by setting state
      setPreviewMode(true);
      setArticleData(article);
      
      // Store in sessionStorage that preview mode is enabled
      sessionStorage.setItem('previewMode', 'enabled');
      sessionStorage.setItem('previewArticleId', article.id);
      
      toast({
        title: "Preview mode enabled",
        description: `Now previewing: ${article.title}`,
      });

      // Navigate to article view with draft mode enabled
      navigate(`/article/${slug}?draft=true`);
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

    await validateAndEnablePreview(slug, secret);
  };

  const handleExitPreview = () => {
    setPreviewMode(false);
    sessionStorage.removeItem('previewMode');
    sessionStorage.removeItem('previewArticleId');
    toast({
      title: "Preview mode disabled",
      description: "You've exited preview mode.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1EAEDB]/30 to-[#8B5CF6]/30 dark:from-[#1EAEDB]/10 dark:to-[#8B5CF6]/10 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#1A1F2C]/90">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-2xl">
              Info Stream Africa Preview Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {previewMode ? (
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
            ) : (
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
                
                <div className="text-sm text-gray-500 dark:text-gray-400 border-t pt-4 mt-6">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">How to use Preview Mode</h4>
                  <p className="mt-1">
                    Preview mode allows editors to view content that has not been published yet. 
                    Enter the article slug and the secret token provided by your administrator.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Frontend Preview</h2>
          <iframe
            src="/"
            title="Website Preview"
            className="w-full h-[600px] border-2 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
