
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmbedUrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
}

const EmbedUrlInput: React.FC<EmbedUrlInputProps> = ({ url, onUrlChange }) => {
  return (
    <div>
      <Label htmlFor="embed-url">URL</Label>
      <Input
        id="embed-url"
        value={url || ''}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com/embed"
        className="mt-1"
      />
    </div>
  );
};

export default EmbedUrlInput;
