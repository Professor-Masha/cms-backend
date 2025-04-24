
import React from 'react';
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { usePreview } from './PreviewProvider';

/**
 * A banner that appears at the top of the page when in preview mode
 */
const PreviewBanner: React.FC = () => {
  const navigate = useNavigate();
  const { disablePreview, previewArticleId } = usePreview();
  
  const handleExit = () => {
    disablePreview();
    navigate('/');
  };
  
  return (
    <div className="bg-amber-500 text-black py-2 px-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-center shadow-md">
      <Eye className="mr-2" size={20} />
      <p className="text-sm font-medium flex-1 text-center">
        Preview Mode Active - You are viewing draft content
        {previewArticleId && <span className="hidden md:inline"> (Article ID: {previewArticleId.substring(0, 8)}...)</span>}
      </p>
      <Button 
        onClick={handleExit}
        variant="secondary"
        size="sm"
        className="ml-2 bg-white hover:bg-gray-100 text-black"
      >
        Exit Preview
      </Button>
    </div>
  );
};

export default PreviewBanner;
