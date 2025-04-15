
import { useState } from 'react';
import AccordionControls from './accordion/AccordionControls';
import AccordionItems from './accordion/AccordionItems';
import AccordionPreview from './accordion/AccordionPreview';

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
      <AccordionControls 
        style={data.style}
        collapsible={data.collapsible}
        multiple={data.multiple}
        onStyleChange={(value) => handleOptionChange('style', value)}
        onCollapsibleChange={(checked) => handleOptionChange('collapsible', checked)}
        onMultipleChange={(checked) => handleOptionChange('multiple', checked)}
      />
      
      <AccordionItems 
        items={data.items}
        editingId={editingId}
        editTitle={editTitle}
        editContent={editContent}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onStartEditing={startEditing}
        onSaveEditing={saveEditing}
        onCancelEditing={cancelEditing}
        onMoveItem={moveItem}
      />
      
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        <AccordionPreview 
          items={data.items}
          style={data.style}
          multiple={data.multiple}
          collapsible={data.collapsible}
        />
      </div>
    </div>
  );
};

export default AccordionBlock;
