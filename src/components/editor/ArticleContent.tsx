
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlockMenu from './BlockMenu';
import DraggableBlockList from './DraggableBlockList';
import { Block, BlockType } from '@/types/cms';
import { DropResult } from 'react-beautiful-dnd';

interface ArticleContentProps {
  blocks: Block[];
  onAddBlock: (blockType: BlockType) => void;
  onUpdateBlock: (index: number, data: any) => void;
  onReorderBlocks: (result: DropResult) => void;
  onRemoveBlock: (index: number) => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  blocks,
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
