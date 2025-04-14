
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VideoBlockProps {
  data: {
    url: string;
    caption: string;
  };
  onChange: (data: any) => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ data, onChange }) => {
  // Extract video ID from YouTube or Vimeo URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Direct embed URL
    if (url.includes('embed') || url.includes('player')) {
      return url;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(data.url);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-url">Video URL (YouTube, Vimeo)</Label>
        <Input
          id="video-url"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="video-caption">Caption (optional)</Label>
        <Textarea
          id="video-caption"
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Video caption or description"
          className="mt-1"
        />
      </div>
      
      {embedUrl && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="Video embed"
              frameBorder="0"
            ></iframe>
          </div>
          {data.caption && (
            <div className="text-sm text-muted-foreground mt-2 text-center">
              {data.caption}
            </div>
          )}
        </div>
      )}
      
      {data.url && !embedUrl && (
        <div className="p-4 border rounded-md text-destructive text-sm">
          Could not parse video URL. Please enter a valid YouTube or Vimeo URL.
        </div>
      )}
    </div>
  );
};

export default VideoBlock;
