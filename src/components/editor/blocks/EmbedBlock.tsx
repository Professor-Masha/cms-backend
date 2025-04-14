
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Twitter, Youtube, Instagram, Facebook, Linkedin } from 'lucide-react';

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
  const [previewError, setPreviewError] = useState(false);

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

  const getWidthClass = () => {
    switch (data.width) {
      case 'small': return 'max-w-md mx-auto';
      case 'medium': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
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

  const generateEmbedCode = () => {
    const height = data.height || 400;
    
    if (!data.url) return '';
    
    switch (data.type) {
      case 'youtube':
        // Convert standard YouTube URL to embed URL
        let videoId;
        if (data.url.includes('youtube.com/watch')) {
          videoId = new URL(data.url).searchParams.get('v');
        } else if (data.url.includes('youtu.be/')) {
          videoId = data.url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
          return `<iframe width="100%" height="${height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
        break;
        
      case 'twitter':
        return `<blockquote class="twitter-tweet" data-conversation="none"><a href="${data.url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
        
      case 'instagram':
        // Instagram requires more complex embedding with their script
        return `<div style="width: 100%; max-width: 540px; margin: 0 auto;"><blockquote class="instagram-media" data-instgrm-permalink="${data.url}" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"></script></div>`;
        
      case 'facebook':
        return `<div id="fb-root"></div><script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v14.0"></script><div class="fb-post" data-href="${data.url}" data-width="100%"></div>`;
        
      case 'linkedin':
        return `<iframe src="${data.url}" height="${height}" width="100%" frameborder="0" allowfullscreen="" title="LinkedIn Embed"></iframe>`;
        
      case 'custom':
      default:
        if (data.customHtml) {
          return data.customHtml;
        } else if (data.url) {
          return `<iframe src="${data.url}" width="100%" height="${height}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }
    
    return '';
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
      
      <div>
        <Label htmlFor="embed-url">URL</Label>
        <Input
          id="embed-url"
          value={data.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/embed"
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="embed-width">Width</Label>
          <Select 
            value={data.width || 'full'} 
            onValueChange={(value) => onChange({
              ...data,
              width: value as 'small' | 'medium' | 'full'
            })}
          >
            <SelectTrigger id="embed-width">
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="embed-height">Height (px)</Label>
          <Input
            id="embed-height"
            type="number"
            value={data.height || 400}
            onChange={(e) => onChange({
              ...data,
              height: parseInt(e.target.value) || 400
            })}
            min={100}
            max={1000}
            className="mt-1"
          />
        </div>
      </div>
      
      {data.type === 'custom' && (
        <div>
          <Label htmlFor="embed-custom">Custom HTML (optional)</Label>
          <Textarea
            id="embed-custom"
            value={data.customHtml || ''}
            onChange={(e) => onChange({ ...data, customHtml: e.target.value })}
            placeholder="<iframe src='...' />"
            rows={5}
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use custom HTML for advanced embeds. If provided, this will override the URL field.
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="embed-caption">Caption (optional)</Label>
        <Input
          id="embed-caption"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Caption for this embed"
          className="mt-1"
        />
      </div>
      
      {data.url && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-4">Preview:</div>
          
          <div className={getWidthClass()}>
            <div className="bg-muted rounded-md overflow-hidden">
              {!previewError ? (
                <div 
                  className="w-full"
                  style={{ height: `${data.height || 400}px` }}
                  dangerouslySetInnerHTML={{ __html: generateEmbedCode() }}
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground h-64">
                  <ExternalLink className="h-10 w-10 mb-2" />
                  <p>Preview not available</p>
                  <p className="text-sm">Embed will show properly on published page</p>
                </div>
              )}
            </div>
            
            {data.caption && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {data.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedBlock;
