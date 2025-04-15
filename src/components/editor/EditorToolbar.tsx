
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Save, Eye, FileUp } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArticleStatus } from '@/types/cms';

interface EditorToolbarProps {
  status: ArticleStatus;
  onStatusChange: (status: ArticleStatus) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  status,
  onStatusChange,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onPreview,
  canUndo,
  canRedo,
  isSaving
}) => {
  return (
    <div className="flex items-center justify-between bg-background sticky top-0 z-10 border-b py-2 px-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUndo} 
          disabled={!canUndo}
          title="Undo"
        >
          <Undo size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRedo} 
          disabled={!canRedo}
          title="Redo"
        >
          <Redo size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={(value) => onStatusChange(value as ArticleStatus)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreview}
          className="flex items-center gap-1"
        >
          <Eye size={16} />
          Preview
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <Save size={16} />
          Save
        </Button>
        
        <Button 
          size="sm" 
          onClick={onPublish}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <FileUp size={16} />
          {status === 'published' ? 'Update' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
