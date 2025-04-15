
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import BlockRenderer from './BlockRenderer';
import { Block, BlockType } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';

interface DraggableBlockListProps {
  blocks: Block[];
  onUpdateBlock: (index: number, data: any) => void;
  onRemoveBlock: (index: number) => void;
  onReorderBlocks: (result: DropResult) => void;
  onAddBlock?: (blockType: BlockType) => void;
}

const DraggableBlockList: React.FC<DraggableBlockListProps> = ({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
  onReorderBlocks,
  onAddBlock
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const result = {
        source: { index },
        destination: { index: index - 1 },
        draggableId: blocks[index].id
      } as DropResult;
      
      onReorderBlocks(result);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < blocks.length - 1) {
      const result = {
        source: { index },
        destination: { index: index + 1 },
        draggableId: blocks[index].id
      } as DropResult;
      
      onReorderBlocks(result);
    }
  };

  const handleDuplicateBlock = (index: number) => {
    if (!onAddBlock) return;
    
    const blockToDuplicate = blocks[index];
    const duplicatedData = JSON.parse(JSON.stringify(blockToDuplicate.data));
    
    // Create a new block with the same type and data
    const newBlock: Block = {
      id: uuidv4(),
      article_id: blockToDuplicate.article_id,
      type: blockToDuplicate.type,
      order: index + 1,
      data: duplicatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insert the duplicated block right after the original one
    const result = {
      source: { index: -1 }, // Special flag for duplication
      destination: { index: index + 1 },
      draggableId: newBlock.id,
      duplicatedBlock: newBlock
    } as unknown as DropResult;
    
    onReorderBlocks(result);
  };

  const handleGroupBlocks = () => {
    // This will be implemented in a future update
    console.log("Group blocks feature coming soon");
  };

  return (
    <DragDropContext onDragEnd={onReorderBlocks}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
            onClick={() => setSelectedBlockIndex(null)}
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BlockRenderer
                      block={block}
                      index={index}
                      onChange={(data) => onUpdateBlock(index, data)}
                      onDelete={() => onRemoveBlock(index)}
                      onMoveUp={() => handleMoveUp(index)}
                      onMoveDown={() => handleMoveDown(index)}
                      onDuplicate={() => handleDuplicateBlock(index)}
                      onGroup={handleGroupBlocks}
                      canMoveUp={index > 0}
                      canMoveDown={index < blocks.length - 1}
                      isSelected={selectedBlockIndex === index}
                      onSelect={() => setSelectedBlockIndex(index)}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableBlockList;
