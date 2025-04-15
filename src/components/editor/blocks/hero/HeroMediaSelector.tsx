
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { ImageIcon } from 'lucide-react';

interface HeroMediaSelectorProps {
  backgroundUrl: string;
  onMediaSelect: (media: Media) => void;
}

const HeroMediaSelector: React.FC<HeroMediaSelectorProps> = ({
  backgroundUrl,
  onMediaSelect
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMediaSelect = (media: Media) => {
    onMediaSelect(media);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="mr-2 h-4 w-4" />
          {backgroundUrl ? 'Change Background' : 'Select Background'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogTitle>Media Library</DialogTitle>
        <MediaLibrary 
          onSelect={handleMediaSelect} 
          onClose={() => setDialogOpen(false)}
          mediaType="image"
        />
      </DialogContent>
    </Dialog>
  );
};

export default HeroMediaSelector;
