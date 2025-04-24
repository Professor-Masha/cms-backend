
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import PreviewBanner from './PreviewBanner';

// Define the context type
type PreviewContextType = {
  isPreviewMode: boolean;
  previewArticleId: string | null;
  enablePreview: (articleId: string) => void;
  disablePreview: () => void;
};

// Create context with default values
const PreviewContext = createContext<PreviewContextType>({
  isPreviewMode: false,
  previewArticleId: null,
  enablePreview: () => {},
  disablePreview: () => {},
});

// Custom hook to use the preview context
export const usePreview = () => useContext(PreviewContext);

export const PreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [previewArticleId, setPreviewArticleId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Check if we should enable preview mode from URL or session storage
  useEffect(() => {
    const draftParam = searchParams.get('draft');
    const slugParam = searchParams.get('slug');
    const secretParam = searchParams.get('secret');
    const storedPreviewMode = sessionStorage.getItem('previewMode');
    
    // Enable preview mode if either URL params or sessionStorage indicate preview mode
    if ((draftParam === 'true' && secretParam) || storedPreviewMode === 'enabled') {
      setIsPreviewMode(true);
      
      // Try to get article ID from URL or session storage
      const articleId = searchParams.get('articleId') || sessionStorage.getItem('previewArticleId');
      if (articleId) {
        setPreviewArticleId(articleId);
        sessionStorage.setItem('previewArticleId', articleId);
      }
      
      // Store preview mode state
      sessionStorage.setItem('previewMode', 'enabled');
    }
  }, [searchParams, location.pathname]);
  
  // Function to enable preview mode
  const enablePreview = (articleId: string) => {
    setIsPreviewMode(true);
    setPreviewArticleId(articleId);
    sessionStorage.setItem('previewMode', 'enabled');
    sessionStorage.setItem('previewArticleId', articleId);
  };
  
  // Function to disable preview mode
  const disablePreview = () => {
    setIsPreviewMode(false);
    setPreviewArticleId(null);
    sessionStorage.removeItem('previewMode');
    sessionStorage.removeItem('previewArticleId');
  };
  
  return (
    <PreviewContext.Provider 
      value={{ 
        isPreviewMode, 
        previewArticleId, 
        enablePreview, 
        disablePreview 
      }}
    >
      {isPreviewMode && <PreviewBanner />}
      {children}
    </PreviewContext.Provider>
  );
};

export default PreviewProvider;
