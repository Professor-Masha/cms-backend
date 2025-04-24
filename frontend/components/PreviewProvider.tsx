
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  
  // Check if we should enable preview mode from URL or session storage
  useEffect(() => {
    const draftParam = searchParams.get('draft');
    const storedPreviewMode = sessionStorage.getItem('previewMode');
    
    if (draftParam === 'true' || storedPreviewMode === 'enabled') {
      setIsPreviewMode(true);
      
      // Try to get article ID from session storage
      const storedArticleId = sessionStorage.getItem('previewArticleId');
      if (storedArticleId) {
        setPreviewArticleId(storedArticleId);
      }
    }
  }, [searchParams]);
  
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
      {children}
    </PreviewContext.Provider>
  );
};

export default PreviewProvider;
