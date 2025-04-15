
import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface EmbedPreviewProps {
  url: string;
  type: 'twitter' | 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'custom';
  width: 'small' | 'medium' | 'full';
  height: number;
  caption?: string;
  customHtml?: string;
}

const EmbedPreview: React.FC<EmbedPreviewProps> = ({
  url,
  type,
  width,
  height,
  caption,
  customHtml
}) => {
  const [previewError, setPreviewError] = useState(false);

  const getWidthClass = () => {
    switch (width) {
      case 'small': return 'max-w-md mx-auto';
      case 'medium': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  const generateEmbedCode = () => {
    if (!url) return '';
    
    switch (type) {
      case 'youtube':
        // Convert standard YouTube URL to embed URL
        let videoId;
        if (url.includes('youtube.com/watch')) {
          try {
            videoId = new URL(url).searchParams.get('v');
          } catch (e) {
            // Handle invalid URL
            return '';
          }
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        
        if (videoId) {
          return `<iframe width="100%" height="${height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
        break;
        
      case 'twitter':
        return `<blockquote class="twitter-tweet" data-conversation="none"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
        
      case 'instagram':
        return `<div style="width: 100%; max-width: 540px; margin: 0 auto;"><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"></script></div>`;
        
      case 'facebook':
        return `<div id="fb-root"></div><script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v14.0"></script><div class="fb-post" data-href="${url}" data-width="100%"></div>`;
        
      case 'linkedin':
        return `<iframe src="${url}" height="${height}" width="100%" frameborder="0" allowfullscreen="" title="LinkedIn Embed"></iframe>`;
        
      case 'custom':
      default:
        if (customHtml) {
          return customHtml;
        } else if (url) {
          return `<iframe src="${url}" width="100%" height="${height}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }
    
    return '';
  };

  if (!url) {
    return null;
  }

  return (
    <div className="mt-4 border rounded-md p-4">
      <div className="text-sm text-muted-foreground mb-4">Preview:</div>
      
      <div className={getWidthClass()}>
        <div className="bg-muted rounded-md overflow-hidden">
          {!previewError ? (
            <div 
              className="w-full"
              style={{ height: `${height || 400}px` }}
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
        
        {caption && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmbedPreview;
