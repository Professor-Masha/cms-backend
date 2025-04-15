
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmbedSettingsProps {
  width: 'small' | 'medium' | 'full';
  height: number;
  type: 'twitter' | 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'custom';
  caption: string;
  customHtml: string;
  onWidthChange: (width: 'small' | 'medium' | 'full') => void;
  onHeightChange: (height: number) => void;
  onCaptionChange: (caption: string) => void;
  onCustomHtmlChange: (html: string) => void;
}

const EmbedSettings: React.FC<EmbedSettingsProps> = ({
  width,
  height,
  type,
  caption,
  customHtml,
  onWidthChange,
  onHeightChange,
  onCaptionChange,
  onCustomHtmlChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="embed-width">Width</Label>
          <Select 
            value={width} 
            onValueChange={(value) => onWidthChange(value as 'small' | 'medium' | 'full')}
          >
            <SelectTrigger id="embed-width">
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="embed-height">Height (px)</Label>
          <Input
            id="embed-height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value) || 400)}
            min={100}
            max={1000}
            className="mt-1"
          />
        </div>
      </div>
      
      {type === 'custom' && (
        <div>
          <Label htmlFor="embed-custom">Custom HTML (optional)</Label>
          <Textarea
            id="embed-custom"
            value={customHtml || ''}
            onChange={(e) => onCustomHtmlChange(e.target.value)}
            placeholder="<iframe src='...' />"
            rows={5}
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use custom HTML for advanced embeds. If provided, this will override the URL field.
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="embed-caption">Caption (optional)</Label>
        <Input
          id="embed-caption"
          value={caption || ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Caption for this embed"
          className="mt-1"
        />
      </div>
    </>
  );
};

export default EmbedSettings;
