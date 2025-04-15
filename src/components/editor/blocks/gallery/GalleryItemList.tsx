
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
import { GalleryHorizontal, X, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  mediaId?: string;
}

interface GalleryItemListProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
}

const GalleryItemList: React.FC<GalleryItemListProps> = ({ images, onImagesChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleMediaSelect = (media: Media) => {
    let updatedImages = [...images];
    
    if (currentIndex !== null) {
      // Update existing image
      updatedImages[currentIndex] = {
        id: `img-${Date.now()}-${currentIndex}`,
        url: media.url,
        alt: media.alt_text || '',
        mediaId: media.id
      };
    } else {
      // Add new image
      updatedImages.push({
        id: `img-${Date.now()}-${updatedImages.length}`,
        url: media.url,
        alt: media.alt_text || '',
        mediaId: media.id
      });
    }
    
    onImagesChange(updatedImages);
    setDialogOpen(false);
    setCurrentIndex(null);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    onImagesChange(updatedImages);
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <Label>Images</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentIndex(null)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Image
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
      </div>
      
      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <GalleryHorizontal className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No images added. Click "Add Image" to add images to your gallery.
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="flex items-center gap-3 p-2 border rounded-md mb-2"
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="h-16 w-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{image.url.split('/').pop()}</p>
                <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentIndex(index);
                    setDialogOpen(true);
                  }}
                  className="h-8 w-8"
                >
                  <GalleryHorizontal size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <ArrowUp size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  className="h-8 w-8"
                >
                  <ArrowDown size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryItemList;
