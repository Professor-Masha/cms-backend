
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Media } from '@/types/cms';
import MediaLibrary from '@/components/media/MediaLibrary';
import { Image, AlignLeft, AlignCenter, AlignRight, Link, Upload, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

interface ImageBlockProps {
  data: {
    url: string;
    alt: string;
    caption: string;
    mediaId?: string;
    alignment?: 'left' | 'center' | 'right' | 'none';
    width?: number;
    height?: number;
    aspectRatio?: 'original' | '16:9' | '4:3' | '1:1' | 'custom';
    size?: 'small' | 'medium' | 'large' | 'full';
    borderRadius?: number;
    link?: string;
    openInNewTab?: boolean;
    purpose?: string;
    borderWidth?: number;
    borderColor?: string;
    shadow?: 'none' | 'small' | 'medium' | 'large';
  };
  onChange: (data: any) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ data, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("settings");

  const handleMediaSelect = (media: Media) => {
    onChange({
      ...data,
      url: media.url,
      alt: media.alt_text || '',
      caption: media.caption || '',
      mediaId: media.id
    });
    setDialogOpen(false);
  };

  const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'none') => {
    onChange({
      ...data,
      alignment
    });
  };

  const handleSizePreset = (sizePercentage: number) => {
    onChange({
      ...data,
      width: sizePercentage
    });
  };

  const renderAlignmentTools = () => (
    <div className="flex space-x-1 mb-4">
      <Button 
        variant={data.alignment === 'none' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleAlignment('none')}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">None</span>
        <div className="w-4 h-4 border-2 border-current" />
      </Button>
      <Button 
        variant={data.alignment === 'left' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleAlignment('left')}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Align left</span>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant={data.alignment === 'center' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleAlignment('center')}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Align center</span>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button 
        variant={data.alignment === 'right' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleAlignment('right')}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Align right</span>
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Image</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Image className="mr-2 h-4 w-4" />
              {data.url ? 'Change Image' : 'Select Image'}
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
      
      {!data.url && (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2">
              <Image className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload an image file, pick one from your media library, or add one with a URL.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogTrigger>
              </Dialog>
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
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) {
                    onChange({
                      ...data,
                      url,
                      alt: '',
                      caption: ''
                    });
                  }
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Insert from URL
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {data.url && (
        <>
          {renderAlignmentTools()}
          
          <Tabs 
            defaultValue="settings" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="image-alt" className="text-xs uppercase font-bold text-muted-foreground">
                  Alt Text (Alternative Text)
                </Label>
                <Textarea
                  id="image-alt"
                  value={data.alt}
                  onChange={(e) => onChange({ ...data, alt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image-purpose" className="text-xs uppercase font-bold text-muted-foreground">
                  Describe the purpose of the image
                </Label>
                <Textarea
                  id="image-purpose"
                  value={data.purpose || ''}
                  onChange={(e) => onChange({ ...data, purpose: e.target.value })}
                  placeholder="Leave empty if decorative"
                  className="mt-1"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if the image is purely decorative.
                </p>
              </div>
              
              <div>
                <Label htmlFor="image-caption" className="text-xs uppercase font-bold text-muted-foreground">
                  Caption (optional)
                </Label>
                <Textarea
                  id="image-caption"
                  value={data.caption}
                  onChange={(e) => onChange({ ...data, caption: e.target.value })}
                  placeholder="Add a caption to display beneath the image"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="image-link" className="text-xs uppercase font-bold text-muted-foreground">
                  Link (optional)
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="image-link"
                    value={data.link || ''}
                    onChange={(e) => onChange({ ...data, link: e.target.value })}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className={data.openInNewTab ? "bg-muted" : ""}
                    onClick={() => onChange({ ...data, openInNewTab: !data.openInNewTab })}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.openInNewTab ? "Opens in new tab" : "Opens in same tab"}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4 pt-4">
              <div>
                <Label className="text-xs uppercase font-bold text-muted-foreground">
                  Image Size
                </Label>
                <Select 
                  value={data.size || 'medium'} 
                  onValueChange={(value) => onChange({ ...data, size: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs uppercase font-bold text-muted-foreground">
                  Image dimensions
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div>
                    <Label htmlFor="image-width" className="text-xs">WIDTH</Label>
                    <Input
                      id="image-width"
                      type="number"
                      value={data.width || ''}
                      onChange={(e) => onChange({ ...data, width: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-height" className="text-xs">HEIGHT</Label>
                    <Input
                      id="image-height"
                      type="number"
                      value={data.height || ''}
                      onChange={(e) => onChange({ ...data, height: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Auto"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
                  Presets
                </Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSizePreset(25)}
                    className="flex-1 h-7"
                  >
                    25%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSizePreset(50)}
                    className="flex-1 h-7"
                  >
                    50%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSizePreset(75)}
                    className="flex-1 h-7"
                  >
                    75%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSizePreset(100)}
                    className="flex-1 h-7"
                  >
                    100%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onChange({ ...data, width: undefined, height: undefined })}
                    className="h-7"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="border-radius" className="text-xs uppercase font-bold text-muted-foreground">
                  Border Radius
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="border-radius"
                    value={[data.borderRadius || 0]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => onChange({ ...data, borderRadius: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm min-w-[30px] text-right">{data.borderRadius || 0}px</span>
                </div>
              </div>

              <div>
                <Label htmlFor="border-width" className="text-xs uppercase font-bold text-muted-foreground">
                  Border Width
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="border-width"
                    value={[data.borderWidth || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => onChange({ ...data, borderWidth: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm min-w-[30px] text-right">{data.borderWidth || 0}px</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="border-color" className="text-xs uppercase font-bold text-muted-foreground">
                  Border Color
                </Label>
                <Input
                  id="border-color"
                  type="color"
                  value={data.borderColor || '#000000'}
                  onChange={(e) => onChange({ ...data, borderColor: e.target.value })}
                  className="h-10 w-full"
                />
              </div>
              
              <div>
                <Label className="text-xs uppercase font-bold text-muted-foreground">
                  Shadow
                </Label>
                <Select 
                  value={data.shadow || 'none'} 
                  onValueChange={(value) => onChange({ ...data, shadow: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select shadow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 border rounded-md p-4">
            <div className="text-sm text-muted-foreground mb-2">Preview:</div>
            <figure>
              <div 
                className={`relative ${
                  data.alignment === 'center' ? 'mx-auto' : 
                  data.alignment === 'right' ? 'ml-auto' : 
                  data.alignment === 'left' ? 'mr-auto' : ''
                }`}
                style={{
                  width: data.width ? `${data.width}%` : data.size === 'small' ? '25%' : 
                         data.size === 'medium' ? '50%' : data.size === 'large' ? '75%' : '100%'
                }}
              >
                <img 
                  src={data.url}
                  alt={data.alt}
                  className="max-w-full rounded-md"
                  style={{
                    borderRadius: data.borderRadius ? `${data.borderRadius}px` : undefined,
                    border: data.borderWidth ? `${data.borderWidth}px solid ${data.borderColor || '#000'}` : undefined,
                    boxShadow: data.shadow === 'small' ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : 
                                data.shadow === 'medium' ? '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' :
                                data.shadow === 'large' ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : undefined
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                  }}
                />
                {data.link && (
                  <a 
                    href={data.link} 
                    target={data.openInNewTab ? "_blank" : undefined}
                    rel={data.openInNewTab ? "noopener noreferrer" : undefined}
                    className="absolute inset-0"
                    aria-label={data.alt || "Link"}
                  />
                )}
              </div>
              {data.caption && (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {data.caption}
                </figcaption>
              )}
            </figure>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageBlock;
