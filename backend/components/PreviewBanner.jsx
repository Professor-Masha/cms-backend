
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exitPreviewMode } from '../services/previewService';

/**
 * A banner that appears at the top of the page when in preview mode
 */
const PreviewBanner = () => {
  const navigate = useNavigate();
  
  const handleExit = () => {
    exitPreviewMode();
    navigate('/');
  };
  
  return (
    <div className="bg-amber-500 text-black py-2 px-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-center">
      <p className="text-sm font-medium">
        Preview Mode Active - You are viewing draft content
      </p>
      <button 
        onClick={handleExit}
        className="ml-4 bg-black text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Exit preview mode"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default PreviewBanner;
