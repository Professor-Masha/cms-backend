
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuoteBlockProps {
  data: {
    content: string;
    attribution: string;
  };
  onChange: (data: any) => void;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quote-content">Quote Text</Label>
        <Textarea
          id="quote-content"
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Enter the quote text here..."
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="quote-attribution">Attribution (optional)</Label>
        <Input
          id="quote-attribution"
          value={data.attribution}
          onChange={(e) => onChange({ ...data, attribution: e.target.value })}
          placeholder="Who said this? (e.g., Author Name)"
          className="mt-1"
        />
      </div>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        <blockquote className="border-l-4 border-primary pl-4 italic">
          <p>"{data.content}"</p>
          {data.attribution && (
            <footer className="text-sm text-muted-foreground mt-2">
              — {data.attribution}
            </footer>
          )}
        </blockquote>
      </div>
    </div>
  );
};

export default QuoteBlock;
