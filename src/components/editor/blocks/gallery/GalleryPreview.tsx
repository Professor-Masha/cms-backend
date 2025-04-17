
import React from 'react';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
  columns: 2 | 3 | 4;
  gap: 'small' | 'medium' | 'large';
  caption?: string;
  cropImages?: boolean;
  imageBorderRadius?: number;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({
  images,
  columns,
  gap,
  caption,
  cropImages = false,
  imageBorderRadius = 0
}) => {
  const getGapClass = () => {
    switch (gap) {
      case 'small': return 'gap-2';
      case 'large': return 'gap-6';
      default: return 'gap-4';
    }
  };

  const getColumnsClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-2';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-3';
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="text-sm text-muted-foreground mb-2">Preview:</div>
      <div className={`grid ${getColumnsClass()} ${getGapClass()}`}>
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img 
              src={image.url} 
              alt={image.alt}
              className={`w-full ${cropImages ? 'h-[160px] object-cover' : 'h-auto'} rounded-md`}
              style={{ 
                borderRadius: imageBorderRadius ? `${imageBorderRadius}px` : undefined 
              }}
            />
          </div>
        ))}
      </div>
      {caption && (
        <div className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </div>
      )}
    </div>
  );
};

export default GalleryPreview;
