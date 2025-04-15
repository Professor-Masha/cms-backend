
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AccordionItemEditor from './AccordionItemEditor';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionItemsProps {
  items: AccordionItem[];
  editingId: string | null;
  editTitle: string;
  editContent: string;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onStartEditing: (id: string, title: string, content: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
}

const AccordionItems: React.FC<AccordionItemsProps> = ({
  items,
  editingId,
  editTitle,
  editContent,
  onAddItem,
  onRemoveItem,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onMoveItem
}) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Accordion Items</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddItem}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <AccordionItemEditor
            key={item.id}
            item={item}
            index={index}
            isEditing={editingId === item.id}
            editTitle={editTitle}
            editContent={editContent}
            onStartEditing={onStartEditing}
            onSaveEditing={onSaveEditing}
            onCancelEditing={onCancelEditing}
            onRemoveItem={onRemoveItem}
            onMoveItem={onMoveItem}
            totalItems={items.length}
          />
        ))}
      </div>
    </div>
  );
};

export default AccordionItems;
