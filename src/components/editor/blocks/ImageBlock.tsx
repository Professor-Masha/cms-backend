
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ImageBlockProps {
  data: {
    url: string;
    alt: string;
    caption: string;
  };
  onChange: (data: any) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          placeholder="Image description for accessibility"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="image-caption">Caption (optional)</Label>
        <Textarea
          id="image-caption"
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Image caption or description"
          className="mt-1"
        />
      </div>
      
      {data.url && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
          <figure>
            <img 
              src={data.url}
              alt={data.alt}
              className="max-w-full rounded-md"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
              }}
            />
            {data.caption && (
              <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                {data.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
