
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { Video, Upload, Link } from 'lucide-react';

interface VideoBlockProps {
  data: {
    url: string;
    caption: string;
    mediaId?: string;
  };
  onChange: (data: any) => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ data, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('embed');

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
    
    // Direct video URL (hosted)
    if (/\.(mp4|webm|ogg)$/i.test(url)) {
      return url;
    }
    
    return null;
  };

  const handleMediaSelect = (media: Media) => {
    onChange({
      ...data,
      url: media.url,
      caption: media.caption || '',
      mediaId: media.id
    });
    setDialogOpen(false);
  };

  const embedUrl = getEmbedUrl(data.url);
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(data.url);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Video</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Video className="mr-2 h-4 w-4" />
              {data.url ? 'Change Video' : 'Add Video'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px]">
            <DialogTitle>Add Video</DialogTitle>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="embed">Embed URL</TabsTrigger>
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
              </TabsList>
              
              <TabsContent value="embed">
                <DialogDescription className="mb-4">
                  Enter the URL of a YouTube or Vimeo video
                </DialogDescription>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={data.url}
                      onChange={(e) => onChange({ ...data, url: e.target.value })}
                    />
                    <Button 
                      onClick={() => setDialogOpen(false)}
                      variant="outline"
                    >
                      <Link className="mr-2 h-4 w-4" />
                      Embed
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upload">
                <DialogDescription className="mb-4">
                  Upload a video file or choose from media library
                </DialogDescription>
                <MediaLibrary 
                  onSelect={handleMediaSelect} 
                  onClose={() => setDialogOpen(false)}
                  mediaType="video"
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      <div>
        <Label htmlFor="video-url">Video URL</Label>
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
      
      {embedUrl && !isDirectVideo && (
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
      
      {isDirectVideo && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
          <div className="aspect-video">
            <video
              src={data.url}
              controls
              className="w-full h-full rounded-md"
            />
          </div>
          {data.caption && (
            <div className="text-sm text-muted-foreground mt-2 text-center">
              {data.caption}
            </div>
          )}
        </div>
      )}
      
      {data.url && !embedUrl && !isDirectVideo && (
        <div className="p-4 border rounded-md text-destructive text-sm">
          Could not parse video URL. Please enter a valid YouTube or Vimeo URL, or a direct video file URL.
        </div>
      )}
    </div>
  );
};

export default VideoBlock;
