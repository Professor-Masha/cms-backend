
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Block, BlockType } from '@/types/cms';
import BlockRenderer from './BlockRenderer';

interface DraggableBlockListProps {
  blocks: Block[];
  onUpdateBlock: (index: number, data: any) => void;
  onRemoveBlock: (index: number) => void;
  onReorderBlocks: (result: any) => void;
  onAddBlock: (blockType: BlockType, afterIndex?: number) => void;
}

const DraggableBlockList: React.FC<DraggableBlockListProps> = ({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
  onReorderBlocks,
  onAddBlock,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  return (
    <DragDropContext onDragEnd={onReorderBlocks}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {blocks.map((block, index) => (
              <Draggable
                key={block.id}
                draggableId={block.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="mb-4"
                  >
                    <BlockRenderer
                      block={block}
                      index={index}
                      onChange={(data) => onUpdateBlock(index, data)}
                      onDelete={() => onRemoveBlock(index)}
                      onMoveUp={() => {
                        if (index > 0) {
                          const result = {
                            source: { index },
                            destination: { index: index - 1 },
                          };
                          onReorderBlocks(result);
                          setSelectedBlockIndex(index - 1);
                        }
                      }}
                      onMoveDown={() => {
                        if (index < blocks.length - 1) {
                          const result = {
                            source: { index },
                            destination: { index: index + 1 },
                          };
                          onReorderBlocks(result);
                          setSelectedBlockIndex(index + 1);
                        }
                      }}
                      onDuplicate={() => {
                        const duplicatedData = JSON.parse(JSON.stringify(block.data));
                        const duplicatedBlock = {
                          ...block,
                          id: `temp-${Date.now()}`,
                          data: duplicatedData,
                        };
                        onReorderBlocks({
                          source: { index: -1 },
                          destination: { index: index + 1 },
                          duplicatedBlock,
                        });
                        setSelectedBlockIndex(index + 1);
                      }}
                      onAddBlock={(blockType, afterIndex) => onAddBlock(blockType as BlockType, afterIndex)}
                      canMoveUp={index > 0}
                      canMoveDown={index < blocks.length - 1}
                      isSelected={selectedBlockIndex === index}
                      onSelect={() => setSelectedBlockIndex(index)}
                      dragHandleProps={{
                        ...provided.dragHandleProps,
                      }}
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
