
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

interface HeroControlsProps {
  title: string;
  subtitle: string;
  alignment: 'left' | 'center' | 'right';
  overlayOpacity: number;
  height: 'small' | 'medium' | 'large';
  buttonText: string;
  buttonUrl: string;
  buttonStyle: 'primary' | 'secondary' | 'outline';
  onValueChange: (key: string, value: any) => void;
}

const HeroControls: React.FC<HeroControlsProps> = ({
  title,
  subtitle,
  alignment,
  overlayOpacity,
  height,
  buttonText,
  buttonUrl,
  buttonStyle,
  onValueChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={title || ''}
            onChange={(e) => onValueChange('title', e.target.value)}
            placeholder="Hero Title"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-subtitle">Subtitle (optional)</Label>
          <Input
            id="hero-subtitle"
            value={subtitle || ''}
            onChange={(e) => onValueChange('subtitle', e.target.value)}
            placeholder="Hero Subtitle"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="hero-alignment">Text Alignment</Label>
          <Select 
            value={alignment || 'center'} 
            onValueChange={(value) => onValueChange('alignment', value)}
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
            value={height || 'medium'} 
            onValueChange={(value) => onValueChange('height', value)}
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
            value={String(overlayOpacity || 0.3)} 
            onValueChange={(value) => onValueChange('overlayOpacity', parseFloat(value))}
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
            value={buttonText || ''}
            onChange={(e) => onValueChange('buttonText', e.target.value)}
            placeholder="Call to Action"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-button-url">Button URL (optional)</Label>
          <Input
            id="hero-button-url"
            value={buttonUrl || ''}
            onChange={(e) => onValueChange('buttonUrl', e.target.value)}
            placeholder="https://example.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hero-button-style">Button Style</Label>
          <Select 
            value={buttonStyle || 'primary'} 
            onValueChange={(value) => onValueChange('buttonStyle', value)}
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
    </>
  );
};

export default HeroControls;
