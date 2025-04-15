
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BlockMenu from './BlockMenu';
import DraggableBlockList from './DraggableBlockList';
import { Block, BlockType } from '@/types/cms';
import { DropResult } from 'react-beautiful-dnd';

interface ArticleContentProps {
  title: string;
  slug: string;
  description: string;
  blocks: Block[];
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddBlock: (blockType: BlockType) => void;
  onUpdateBlock: (index: number, data: any) => void;
  onReorderBlocks: (result: DropResult) => void;
  onRemoveBlock: (index: number) => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  slug,
  description,
  blocks,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
  onAddBlock,
  onUpdateBlock,
  onReorderBlocks,
  onRemoveBlock,
}) => {
  // Handler for drag end event
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderBlocks(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Article Title"
              className="text-2xl font-bold"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              URL Slug
            </label>
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="article-url-slug"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description / Excerpt
            </label>
            <Textarea
              value={description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Brief description of the article"
              rows={3}
            />
          </div>
          
          <hr className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Content Blocks</h3>
            
            {blocks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">
                  Add your first content block
                </p>
                <BlockMenu onAddBlock={onAddBlock} />
              </div>
            ) : (
              <div className="space-y-6">
                <DraggableBlockList 
                  blocks={blocks}
                  onUpdateBlock={onUpdateBlock}
                  onRemoveBlock={onRemoveBlock}
                  onReorderBlocks={handleDragEnd}
                />
                
                <BlockMenu onAddBlock={onAddBlock} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
