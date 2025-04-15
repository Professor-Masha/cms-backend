import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical, Edit, Check, X } from 'lucide-react';

interface AccordionBlockProps {
  data: {
    items: Array<{
      id: string;
      title: string;
      content: string;
    }>;
    collapsible: boolean;
    style: 'default' | 'bordered' | 'simple';
    multiple: boolean;
  };
  onChange: (data: any) => void;
}

const AccordionBlock: React.FC<AccordionBlockProps> = ({ data, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const addItem = () => {
    const newItem = {
      id: `accordion-${Date.now()}`,
      title: `Item ${data.items.length + 1}`,
      content: 'New accordion content'
    };
    
    onChange({
      ...data,
      items: [...data.items, newItem]
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter(item => item.id !== id)
    });
  };

  const startEditing = (id: string, title: string, content: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditContent(content);
  };

  const saveEditing = () => {
    if (!editingId) return;
    
    onChange({
      ...data,
      items: data.items.map(item => 
        item.id === editingId 
          ? { ...item, title: editTitle, content: editContent } 
          : item
      )
    });
    
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleOptionChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= data.items.length) return;
    
    const items = [...data.items];
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);
    
    onChange({
      ...data,
      items
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accordion-style">Style</Label>
          <Select 
            value={data.style} 
            onValueChange={(value) => handleOptionChange('style', value)}
          >
            <SelectTrigger id="accordion-style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="accordion-collapsible">Allow All Closed</Label>
            <Switch 
              id="accordion-collapsible"
              checked={data.collapsible}
              onCheckedChange={(checked) => handleOptionChange('collapsible', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="accordion-multiple">Allow Multiple Open</Label>
            <Switch 
              id="accordion-multiple"
              checked={data.multiple}
              onCheckedChange={(checked) => handleOptionChange('multiple', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Accordion Items</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={addItem}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {data.items.map((item, index) => (
            <div key={item.id} className="border rounded-md">
              {editingId === item.id ? (
                <div className="p-3 space-y-2">
                  <div>
                    <Label htmlFor={`edit-title-${item.id}`} className="text-xs">
                      Title
                    </Label>
                    <Input
                      id={`edit-title-${item.id}`}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-content-${item.id}`} className="text-xs">
                      Content
                    </Label>
                    <Textarea
                      id={`edit-content-${item.id}`}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={saveEditing}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <button
                      className="cursor-grab text-muted-foreground mr-2 touch-none p-1"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <GripVertical size={16} />
                    </button>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="h-7 w-7 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === data.items.length - 1}
                      className="h-7 w-7 p-0"
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(item.id, item.title, item.content)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        
        {data.multiple ? (
          <Accordion
            type="multiple"
            defaultValue={data.items.map(item => item.id)}
            className={`${
              data.style === 'bordered' ? 'border rounded-md p-1' :
              data.style === 'simple' ? 'space-y-1' : ''
            }`}
          >
            {data.items.map(item => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Accordion
            type="single"
            defaultValue={data.items.length > 0 ? data.items[0].id : undefined}
            collapsible={data.collapsible}
            className={`${
              data.style === 'bordered' ? 'border rounded-md p-1' :
              data.style === 'simple' ? 'space-y-1' : ''
            }`}
          >
            {data.items.map(item => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default AccordionBlock;
