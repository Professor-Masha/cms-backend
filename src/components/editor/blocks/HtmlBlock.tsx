
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Code } from 'lucide-react';

interface HtmlBlockProps {
  data: {
    html: string;
    description?: string;
  };
  onChange: (data: any) => void;
}

const HtmlBlock: React.FC<HtmlBlockProps> = ({ data, onChange }) => {
  const [showPreview, setShowPreview] = useState(true);
  
  const handleHtmlChange = (html: string) => {
    onChange({
      ...data,
      html
    });
  };
  
  const handleDescriptionChange = (description: string) => {
    onChange({
      ...data,
      description
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <Label>Custom HTML</Label>
        </div>
        <div className="bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded-full flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Use with caution</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="html-description">Description (internal note)</Label>
        <Input
          id="html-description"
          value={data.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe what this HTML does (for your reference only)"
          className="mt-1"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="html-code">HTML Code</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
        
        <Textarea
          id="html-code"
          value={data.html || ''}
          onChange={(e) => handleHtmlChange(e.target.value)}
          placeholder="<div>Your custom HTML here</div>"
          rows={8}
          className="mt-1 font-mono text-sm"
        />
        
        <div className="text-xs text-muted-foreground mt-1 space-y-1">
          <p>⚠️ Warning: Custom HTML can be a security risk. Only use HTML from trusted sources.</p>
          <p>✓ You can include styling, scripts, and external resources.</p>
          <p>✗ Changes may not be fully visible in the preview but will work on published pages.</p>
        </div>
      </div>
      
      {showPreview && data.html && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-4 flex items-center justify-between">
            <span>Preview:</span>
            {data.description && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {data.description}
              </span>
            )}
          </div>
          
          <div className="border rounded-md p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: data.html }} />
          </div>
          
          <div className="text-xs text-muted-foreground mt-4">
            <p>Note: Some HTML features may not work in the preview but will function when published.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlBlock;
