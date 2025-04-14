
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { ImageIcon, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

interface HeroBlockProps {
  data: {
    backgroundUrl: string;
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
    mediaId?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonStyle?: 'primary' | 'secondary' | 'outline';
    height?: 'small' | 'medium' | 'large';
  };
  onChange: (data: any) => void;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ data, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMediaSelect = (media: Media) => {
    onChange({
      ...data,
      backgroundUrl: media.url,
      mediaId: media.id
    });
    setDialogOpen(false);
  };

  const getHeightClass = () => {
    switch (data.height) {
      case 'small': return 'h-64';
      case 'large': return 'h-screen';
      default: return 'h-96';
    }
  };

  const getAlignmentClass = () => {
    switch (data.alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const getButtonClass = () => {
    switch (data.buttonStyle) {
      case 'secondary': return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      case 'outline': return 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground';
      default: return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Hero Banner</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              {data.backgroundUrl ? 'Change Background' : 'Select Background'}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Hero Title"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-subtitle">Subtitle (optional)</Label>
          <Input
            id="hero-subtitle"
            value={data.subtitle || ''}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            placeholder="Hero Subtitle"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="hero-alignment">Text Alignment</Label>
          <Select 
            value={data.alignment || 'center'} 
            onValueChange={(value) => onChange({
              ...data,
              alignment: value as 'left' | 'center' | 'right'
            })}
          >
            <SelectTrigger id="hero-alignment">
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">
                <div className="flex items-center">
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Left
                </div>
              </SelectItem>
              <SelectItem value="center">
                <div className="flex items-center">
                  <AlignCenter className="mr-2 h-4 w-4" />
                  Center
                </div>
              </SelectItem>
              <SelectItem value="right">
                <div className="flex items-center">
                  <AlignRight className="mr-2 h-4 w-4" />
                  Right
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="hero-height">Banner Height</Label>
          <Select 
            value={data.height || 'medium'} 
            onValueChange={(value) => onChange({
              ...data,
              height: value as 'small' | 'medium' | 'large'
            })}
          >
            <SelectTrigger id="hero-height">
              <SelectValue placeholder="Height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Fullscreen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="hero-overlay">Overlay Opacity</Label>
          <Select 
            value={String(data.overlayOpacity || 0.3)} 
            onValueChange={(value) => onChange({
              ...data,
              overlayOpacity: parseFloat(value)
            })}
          >
            <SelectTrigger id="hero-overlay">
              <SelectValue placeholder="Overlay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="0.1">Light (10%)</SelectItem>
              <SelectItem value="0.3">Medium (30%)</SelectItem>
              <SelectItem value="0.5">Heavy (50%)</SelectItem>
              <SelectItem value="0.7">Extra Heavy (70%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="hero-button-text">Button Text (optional)</Label>
          <Input
            id="hero-button-text"
            value={data.buttonText || ''}
            onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
            placeholder="Call to Action"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-button-url">Button URL (optional)</Label>
          <Input
            id="hero-button-url"
            value={data.buttonUrl || ''}
            onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
            placeholder="https://example.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-button-style">Button Style</Label>
          <Select 
            value={data.buttonStyle || 'primary'} 
            onValueChange={(value) => onChange({
              ...data,
              buttonStyle: value as 'primary' | 'secondary' | 'outline'
            })}
          >
            <SelectTrigger id="hero-button-style">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(data.backgroundUrl || data.title) && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="text-sm text-muted-foreground p-2">Preview:</div>
          <div className={`relative ${getHeightClass()} overflow-hidden`}>
            {data.backgroundUrl && (
              <>
                <img 
                  src={data.backgroundUrl} 
                  alt="Hero Background" 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/1200x600?text=Image+Not+Found';
                  }}
                />
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: data.overlayOpacity || 0.3 }}
                ></div>
              </>
            )}
            <div className={`relative flex flex-col items-center justify-center h-full px-6 ${getAlignmentClass()}`}>
              {data.title && (
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {data.title}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-lg text-white/90 mb-6">
                  {data.subtitle}
                </p>
              )}
              {data.buttonText && (
                <button className={`px-6 py-2 rounded-md ${getButtonClass()}`}>
                  {data.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBlock;
