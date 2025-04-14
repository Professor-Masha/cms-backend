
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ButtonBlockProps {
  data: {
    text: string;
    url: string;
    style: string;
  };
  onChange: (data: any) => void;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-text">Button Text</Label>
        <Input
          id="button-text"
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          placeholder="Click Me"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="button-url">Button URL</Label>
        <Input
          id="button-url"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://example.com"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="button-style">Button Style</Label>
        <Select
          value={data.style}
          onValueChange={(value) => onChange({ ...data, style: value })}
        >
          <SelectTrigger id="button-style" className="mt-1">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        <div className="flex justify-center">
          {data.style === 'primary' && (
            <Button asChild>
              <a href={data.url || '#'} target="_blank" rel="noreferrer">{data.text}</a>
            </Button>
          )}
          {data.style === 'secondary' && (
            <Button variant="secondary" asChild>
              <a href={data.url || '#'} target="_blank" rel="noreferrer">{data.text}</a>
            </Button>
          )}
          {data.style === 'outline' && (
            <Button variant="outline" asChild>
              <a href={data.url || '#'} target="_blank" rel="noreferrer">{data.text}</a>
            </Button>
          )}
          {data.style === 'link' && (
            <Button variant="link" asChild>
              <a href={data.url || '#'} target="_blank" rel="noreferrer">{data.text}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonBlock;
