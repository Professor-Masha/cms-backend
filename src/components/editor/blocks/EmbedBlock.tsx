
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ExternalLink, Twitter, Youtube, Instagram, Facebook, Linkedin } from 'lucide-react';
import EmbedUrlInput from './embed/EmbedUrlInput';
import EmbedSettings from './embed/EmbedSettings';
import EmbedPreview from './embed/EmbedPreview';

interface EmbedBlockProps {
  data: {
    url: string;
    type?: 'twitter' | 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'custom';
    caption?: string;
    width?: 'small' | 'medium' | 'full';
    height?: number;
    customHtml?: string;
  };
  onChange: (data: any) => void;
}

const EmbedBlock: React.FC<EmbedBlockProps> = ({ data, onChange }) => {
  const detectEmbedType = (url: string) => {
    if (!url) return 'custom';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('linkedin.com')) return 'linkedin';
    return 'custom';
  };

  const handleUrlChange = (url: string) => {
    const type = detectEmbedType(url);
    onChange({ ...data, url, type });
  };

  const getEmbedIcon = () => {
    switch (data.type) {
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Embed</Label>
          {data.type && (
            <div className="bg-muted text-muted-foreground text-xs py-1 px-2 rounded-full flex items-center gap-1">
              {getEmbedIcon()}
              <span className="capitalize">{data.type}</span>
            </div>
          )}
        </div>
      </div>
      
      <EmbedUrlInput 
        url={data.url || ''}
        onUrlChange={handleUrlChange}
      />
      
      <EmbedSettings 
        width={data.width || 'full'}
        height={data.height || 400}
        type={data.type || 'custom'}
        caption={data.caption || ''}
        customHtml={data.customHtml || ''}
        onWidthChange={(value) => handleSettingChange('width', value)}
        onHeightChange={(value) => handleSettingChange('height', value)}
        onCaptionChange={(value) => handleSettingChange('caption', value)}
        onCustomHtmlChange={(value) => handleSettingChange('customHtml', value)}
      />
      
      <EmbedPreview 
        url={data.url || ''}
        type={data.type || 'custom'}
        width={data.width || 'full'}
        height={data.height || 400}
        caption={data.caption}
        customHtml={data.customHtml}
      />
    </div>
  );
};

export default EmbedBlock;
