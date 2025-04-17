
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { X, Plus, Image, Upload, ExternalLink } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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

const GalleryItemList: React.FC<GalleryItemListProps> = ({ 
  images, 
  onImagesChange 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (media: Media) => {
    const newImage: GalleryImage = {
      id: uuidv4(),
      url: media.url,
      alt: media.alt_text || '',
      mediaId: media.id
    };
    
    onImagesChange([...images, newImage]);
    setDialogOpen(false);
  };

  const handleImageAltChange = (id: string, alt: string) => {
    const updatedImages = images.map(image => 
      image.id === id ? { ...image, alt } : image
    );
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter(image => image.id !== id);
    onImagesChange(updatedImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage: GalleryImage = {
            id: uuidv4(),
            url: event.target.result as string,
            alt: file.name.split('.')[0] || ''
          };
          
          onImagesChange([...images, newImage]);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const newImage: GalleryImage = {
        id: uuidv4(),
        url,
        alt: ''
      };
      
      onImagesChange([...images, newImage]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Gallery Images</Label>
      
      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2">
              <Image className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Add images to create a gallery. You can upload images, pick from your media library, or add from URL.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Media Library
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUrlInput}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                From URL
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group border rounded-md overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  value={image.alt} 
                  onChange={(e) => handleImageAltChange(image.id, e.target.value)}
                  placeholder="Alt text"
                  className="text-xs mt-1 border-0 bg-muted"
                />
              </div>
            ))}
            
            <div className="border-2 border-dashed rounded-md flex items-center justify-center p-4 min-h-[7rem]">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-full w-full">
                    <Plus className="h-6 w-6 text-muted-foreground" />
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
          </div>
          
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {images.length} image{images.length !== 1 ? 's' : ''} in gallery
            </p>
            
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Media Library
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUrlInput}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                From URL
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryItemList;
