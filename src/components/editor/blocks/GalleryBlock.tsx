
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { GalleryHorizontal, X, ArrowUp, ArrowDown, Plus } from 'lucide-react';

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
  };
  onChange: (data: any) => void;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({ data, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Default values
  const images = data.images || [];
  const columns = data.columns || 3;
  const gap = data.gap || 'medium';
  const caption = data.caption || '';

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
    
    onChange({
      ...data,
      images: updatedImages
    });
    
    setDialogOpen(false);
    setCurrentIndex(null);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onChange({
      ...data,
      images: updatedImages
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    onChange({
      ...data,
      images: updatedImages
    });
  };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="gallery-columns">Columns</Label>
          <Select 
            value={columns.toString()} 
            onValueChange={(value) => onChange({
              ...data,
              columns: parseInt(value) as 2 | 3 | 4
            })}
          >
            <SelectTrigger id="gallery-columns" className="w-full sm:w-24">
              <SelectValue placeholder="Columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Label htmlFor="gallery-gap">Gap Size</Label>
          <Select 
            value={gap} 
            onValueChange={(value) => onChange({
              ...data,
              gap: value as 'small' | 'medium' | 'large'
            })}
          >
            <SelectTrigger id="gallery-gap" className="w-full sm:w-32">
              <SelectValue placeholder="Gap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="gallery-caption">Gallery Caption (optional)</Label>
        <Input
          id="gallery-caption"
          value={caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Caption for the entire gallery"
        />
      </div>
      
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
          <div className="space-y-4">
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
            
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Preview:</div>
              <div className={`grid ${getColumnsClass()} ${getGapClass()}`}>
                {images.map((image) => (
                  <img 
                    key={image.id}
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-auto rounded-md"
                  />
                ))}
              </div>
              {caption && (
                <div className="text-sm text-muted-foreground mt-2 text-center">
                  {caption}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryBlock;
