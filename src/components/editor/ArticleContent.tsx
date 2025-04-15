
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlockMenu from './BlockMenu';
import DraggableBlockList from './DraggableBlockList';
import { Block, BlockType } from '@/types/cms';
import { DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

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
  // Enhanced handler for drag end event with support for duplication
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Handle block duplication
    if (result.source.index === -1 && 'duplicatedBlock' in result) {
      const customResult = result as unknown as { duplicatedBlock: Block };
      const newBlocks = [...blocks];
      newBlocks.splice(result.destination.index, 0, customResult.duplicatedBlock);
      
      // Reindex blocks
      const reindexedBlocks = newBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));
      
      // Create a standard DropResult for the parent component
      const standardResult: DropResult = {
        draggableId: customResult.duplicatedBlock.id,
        type: 'DEFAULT',
        source: {
          index: blocks.length, // Coming from the end
          droppableId: 'blocks'
        },
        destination: {
          index: result.destination.index,
          droppableId: 'blocks'
        },
        reason: 'DROP',
        mode: 'FLUID'
      };
      
      // Pass both the blocks and the result to the parent
      onReorderBlocks(standardResult);
      return;
    }
    
    onReorderBlocks(result);
  };

  // Function to handle block type creation
  const handleAddBlock = (blockType: BlockType) => {
    onAddBlock(blockType);
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
              <BlockMenu onAddBlock={handleAddBlock} />
            </div>
          ) : (
            <div className="space-y-6">
              <DraggableBlockList 
                blocks={blocks}
                onUpdateBlock={onUpdateBlock}
                onRemoveBlock={onRemoveBlock}
                onReorderBlocks={handleDragEnd}
                onAddBlock={onAddBlock}
              />
              
              <BlockMenu onAddBlock={handleAddBlock} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
