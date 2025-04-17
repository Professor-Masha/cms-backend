
import { useState } from 'react';
import GallerySettings from './gallery/GallerySettings';
import GalleryItemList from './gallery/GalleryItemList';
import GalleryPreview from './gallery/GalleryPreview';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  mediaId?: string;
}

interface GalleryBlockProps {
  data: {
    images: GalleryImage[];
    caption?: string;
    columns?: 2 | 3 | 4;
    gap?: 'small' | 'medium' | 'large';
    cropImages?: boolean;
    imageBorderRadius?: number;
  };
  onChange: (data: any) => void;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({ data, onChange }) => {
  // Default values
  const images = data.images || [];
  const columns = data.columns || 3;
  const gap = data.gap || 'medium';
  const caption = data.caption || '';
  const cropImages = data.cropImages || false;
  const imageBorderRadius = data.imageBorderRadius || 0;

  const handleImagesChange = (newImages: GalleryImage[]) => {
    onChange({
      ...data,
      images: newImages
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <GallerySettings 
        columns={columns}
        gap={gap}
        caption={caption}
        cropImages={cropImages}
        imageBorderRadius={imageBorderRadius}
        onColumnsChange={(value) => handleSettingChange('columns', value)}
        onGapChange={(value) => handleSettingChange('gap', value)}
        onCaptionChange={(value) => handleSettingChange('caption', value)}
        onCropImagesChange={(value) => handleSettingChange('cropImages', value)}
        onImageBorderRadiusChange={(value) => handleSettingChange('imageBorderRadius', value)}
      />
      
      <GalleryItemList 
        images={images}
        onImagesChange={handleImagesChange}
      />
      
      <div className="border rounded-md p-4">
        <GalleryPreview 
          images={images}
          columns={columns}
          gap={gap}
          caption={caption}
          cropImages={cropImages}
          imageBorderRadius={imageBorderRadius}
        />
      </div>
    </div>
  );
};

export default GalleryBlock;
