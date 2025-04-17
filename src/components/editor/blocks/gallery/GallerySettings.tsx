
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface GallerySettingsProps {
  columns: 2 | 3 | 4;
  gap: 'small' | 'medium' | 'large';
  caption: string;
  cropImages?: boolean;
  imageBorderRadius?: number;
  onColumnsChange: (columns: 2 | 3 | 4) => void;
  onGapChange: (gap: 'small' | 'medium' | 'large') => void;
  onCaptionChange: (caption: string) => void;
  onCropImagesChange?: (crop: boolean) => void;
  onImageBorderRadiusChange?: (radius: number) => void;
}

const GallerySettings: React.FC<GallerySettingsProps> = ({
  columns,
  gap,
  caption,
  cropImages = false,
  imageBorderRadius = 0,
  onColumnsChange,
  onGapChange,
  onCaptionChange,
  onCropImagesChange,
  onImageBorderRadiusChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="gallery-columns">Columns</Label>
          <Select 
            value={columns.toString()} 
            onValueChange={(value) => onColumnsChange(parseInt(value) as 2 | 3 | 4)}
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
            onValueChange={(value) => onGapChange(value as 'small' | 'medium' | 'large')}
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
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="crop-images"
          checked={cropImages} 
          onCheckedChange={onCropImagesChange}
        />
        <Label htmlFor="crop-images">Crop images to fit</Label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="image-border-radius">Border Radius</Label>
          <span className="text-sm text-muted-foreground">{imageBorderRadius}px</span>
        </div>
        <Slider
          id="image-border-radius"
          value={[imageBorderRadius]} 
          min={0} 
          max={24} 
          step={1}
          onValueChange={(value) => onImageBorderRadiusChange?.(value[0])}
        />
      </div>
      
      <div>
        <Label htmlFor="gallery-caption">Gallery Caption (optional)</Label>
        <Input
          id="gallery-caption"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Caption for the entire gallery"
        />
      </div>
    </div>
  );
};

export default GallerySettings;
