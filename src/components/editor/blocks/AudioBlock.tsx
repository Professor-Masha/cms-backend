
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { AudioLines } from 'lucide-react';

interface AudioBlockProps {
  data: {
    url: string;
    title: string;
    artist?: string;
    caption?: string;
    mediaId?: string;
  };
  onChange: (data: any) => void;
}

const AudioBlock: React.FC<AudioBlockProps> = ({ data, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMediaSelect = (media: Media) => {
    onChange({
      ...data,
      url: media.url,
      title: media.alt_text || '',
      caption: media.caption || '',
      mediaId: media.id
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Audio</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <AudioLines className="mr-2 h-4 w-4" />
              {data.url ? 'Change Audio' : 'Add Audio'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px]">
            <DialogTitle>Media Library</DialogTitle>
            <MediaLibrary 
              onSelect={handleMediaSelect} 
              onClose={() => setDialogOpen(false)}
              mediaType="audio"
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div>
        <Label htmlFor="audio-url">Audio URL</Label>
        <Input
          id="audio-url"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://example.com/audio.mp3"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="audio-title">Title</Label>
        <Input
          id="audio-title"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Audio title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="audio-artist">Artist (optional)</Label>
        <Input
          id="audio-artist"
          value={data.artist || ''}
          onChange={(e) => onChange({ ...data, artist: e.target.value })}
          placeholder="Artist name"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="audio-caption">Caption (optional)</Label>
        <Textarea
          id="audio-caption"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Audio description"
          className="mt-1"
        />
      </div>
      
      {data.url && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center gap-4 mb-2">
              <AudioLines size={24} className="text-primary" />
              <div>
                {data.title && <div className="font-medium">{data.title}</div>}
                {data.artist && <div className="text-sm text-muted-foreground">{data.artist}</div>}
              </div>
            </div>
            <audio
              src={data.url}
              controls
              className="w-full"
            />
            {data.caption && (
              <div className="text-sm text-muted-foreground mt-2">
                {data.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBlock;
