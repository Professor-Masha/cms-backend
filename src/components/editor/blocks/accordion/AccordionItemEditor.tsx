
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Edit, Check, X, Trash2 } from 'lucide-react';

interface AccordionItemProps {
  item: {
    id: string;
    title: string;
    content: string;
  };
  index: number;
  isEditing: boolean;
  editTitle: string;
  editContent: string;
  onStartEditing: (id: string, title: string, content: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  totalItems: number;
}

const AccordionItemEditor: React.FC<AccordionItemProps> = ({
  item,
  index,
  isEditing,
  editTitle,
  editContent,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onRemoveItem,
  onMoveItem,
  totalItems
}) => {
  return (
    <div key={item.id} className="border rounded-md">
      {isEditing ? (
        <div className="p-3 space-y-2">
          <div>
            <Label htmlFor={`edit-title-${item.id}`} className="text-xs">
              Title
            </Label>
            <Input
              id={`edit-title-${item.id}`}
              value={editTitle}
              onChange={(e) => onStartEditing(item.id, e.target.value, editContent)}
            />
          </div>
          <div>
            <Label htmlFor={`edit-content-${item.id}`} className="text-xs">
              Content
            </Label>
            <Textarea
              id={`edit-content-${item.id}`}
              value={editContent}
              onChange={(e) => onStartEditing(item.id, editTitle, e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelEditing}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={onSaveEditing}
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
              onClick={() => onMoveItem(index, index - 1)}
              disabled={index === 0}
              className="h-7 w-7 p-0"
            >
              ↑
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMoveItem(index, index + 1)}
              disabled={index === totalItems - 1}
              className="h-7 w-7 p-0"
            >
              ↓
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onStartEditing(item.id, item.title, item.content)}
              className="h-7 w-7 p-0"
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveItem(item.id)}
              className="h-7 w-7 p-0 text-destructive"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionItemEditor;
