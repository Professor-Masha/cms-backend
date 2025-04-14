
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlusIcon, Trash2 } from 'lucide-react';

interface ListBlockProps {
  data: {
    items: string[];
    style: 'ordered' | 'unordered';
  };
  onChange: (data: any) => void;
}

const ListBlock: React.FC<ListBlockProps> = ({ data, onChange }) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({ ...data, items: [...data.items, ''] });
  };

  const removeItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={data.style}
        onValueChange={(value) => onChange({ ...data, style: value })}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="unordered" id="unordered" />
          <Label htmlFor="unordered">Bullet Points</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ordered" id="ordered" />
          <Label htmlFor="ordered">Numbered List</Label>
        </div>
      </RadioGroup>
      
      <div className="space-y-2">
        {data.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground w-6 text-center">
              {data.style === 'ordered' ? index + 1 : '•'}
            </span>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="List item"
              className="flex-grow"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={data.items.length <= 1}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="flex items-center gap-1"
      >
        <PlusIcon size={16} />
        Add Item
      </Button>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        {data.style === 'unordered' ? (
          <ul className="list-disc ml-6 space-y-1">
            {data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <ol className="list-decimal ml-6 space-y-1">
            {data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default ListBlock;
