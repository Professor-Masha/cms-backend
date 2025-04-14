
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ListCollapse, Plus, DragVertical, X, MoveVertical } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionBlockProps {
  data: {
    items: AccordionItem[];
    defaultOpen?: string | null;
    collapsible?: boolean;
    style?: 'default' | 'bordered' | 'separated';
    multiple?: boolean;
  };
  onChange: (data: any) => void;
}

const AccordionBlock: React.FC<AccordionBlockProps> = ({ data, onChange }) => {
  const [openPreviewItems, setOpenPreviewItems] = useState<string[]>(
    data.defaultOpen ? [data.defaultOpen] : []
  );
  
  const items = data.items || [];
  const collapsible = data.collapsible ?? true;
  const style = data.style || 'default';
  const multiple = data.multiple ?? false;
  
  const addItem = () => {
    const newId = `accordion-${Date.now()}`;
    const newItems = [
      ...items,
      {
        id: newId,
        title: 'New item title',
        content: 'New item content goes here.'
      }
    ];
    
    onChange({
      ...data,
      items: newItems,
      defaultOpen: data.defaultOpen || (items.length === 0 ? newId : data.defaultOpen)
    });
  };
  
  const updateItem = (index: number, field: keyof AccordionItem, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    onChange({
      ...data,
      items: newItems
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    const removedItem = newItems[index];
    newItems.splice(index, 1);
    
    // If the removed item was the default open one, update defaultOpen
    let newDefaultOpen = data.defaultOpen;
    if (data.defaultOpen === removedItem.id) {
      newDefaultOpen = newItems.length > 0 ? newItems[0].id : null;
    }
    
    onChange({
      ...data,
      items: newItems,
      defaultOpen: newDefaultOpen
    });
    
    // Also update the preview state
    if (openPreviewItems.includes(removedItem.id)) {
      setOpenPreviewItems(openPreviewItems.filter(id => id !== removedItem.id));
    }
  };
  
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    
    onChange({
      ...data,
      items: newItems
    });
  };
  
  const setDefaultOpen = (itemId: string) => {
    onChange({
      ...data,
      defaultOpen: data.defaultOpen === itemId ? null : itemId
    });
  };
  
  const handlePreviewValueChange = (value: string[]) => {
    setOpenPreviewItems(value);
  };
  
  const handlePreviewItemClick = (itemId: string) => {
    if (multiple) {
      setOpenPreviewItems(
        openPreviewItems.includes(itemId)
          ? openPreviewItems.filter(id => id !== itemId)
          : [...openPreviewItems, itemId]
      );
    } else {
      setOpenPreviewItems(
        openPreviewItems.includes(itemId) && collapsible
          ? []
          : [itemId]
      );
    }
  };
  
  const getItemClass = () => {
    switch (style) {
      case 'bordered': return 'border-2 rounded-md p-2 mb-2';
      case 'separated': return 'border rounded-md p-2 mb-4 shadow-sm';
      default: return 'border-b';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListCollapse className="h-5 w-5 text-primary" />
          <Label>Accordion</Label>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addItem}
        >
          <Plus className="mr-1 h-3 w-3" /> Add Item
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="accordion-style">Style</Label>
          <Select 
            id="accordion-style"
            value={style} 
            onValueChange={(value) => onChange({
              ...data,
              style: value as 'default' | 'bordered' | 'separated'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="separated">Separated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="accordion-collapsible" className="cursor-pointer select-none">
            Allow collapsing all items
          </Label>
          <input
            id="accordion-collapsible"
            type="checkbox"
            checked={collapsible}
            onChange={(e) => onChange({
              ...data,
              collapsible: e.target.checked
            })}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="accordion-multiple" className="cursor-pointer select-none">
            Allow multiple open items
          </Label>
          <input
            id="accordion-multiple"
            type="checkbox"
            checked={multiple}
            onChange={(e) => onChange({
              ...data,
              multiple: e.target.checked
            })}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DragVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <span className="font-medium">Item {index + 1}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <MoveVertical className="h-4 w-4 rotate-180" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="h-8 w-8"
                >
                  <MoveVertical className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant={data.defaultOpen === item.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDefaultOpen(item.id)}
                  className="text-xs h-8"
                >
                  {data.defaultOpen === item.id ? 'Default Open' : 'Set Default'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Label htmlFor={`item-title-${index}`}>Title</Label>
                <Input
                  id={`item-title-${index}`}
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Item title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`item-content-${index}`}>Content</Label>
                <Textarea
                  id={`item-content-${index}`}
                  value={item.content}
                  onChange={(e) => updateItem(index, 'content', e.target.value)}
                  placeholder="Item content"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">
              No accordion items added yet
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="mt-2"
            >
              <Plus className="mr-1 h-3 w-3" /> Add Item
            </Button>
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-4">Preview:</div>
          
          <Accordion
            type={multiple ? "multiple" : "single"}
            defaultValue={data.defaultOpen ? [data.defaultOpen] : []}
            collapsible={collapsible}
            value={openPreviewItems}
            className="w-full"
          >
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id} className={getItemClass()}>
                <AccordionTrigger
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviewItemClick(item.id);
                  }}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default AccordionBlock;
