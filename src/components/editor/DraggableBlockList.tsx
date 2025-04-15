
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import BlockRenderer from './BlockRenderer';
import { Block } from '@/types/cms';

interface DraggableBlockListProps {
  blocks: Block[];
  onUpdateBlock: (index: number, data: any) => void;
  onRemoveBlock: (index: number) => void;
  onReorderBlocks: (result: DropResult) => void;
}

const DraggableBlockList: React.FC<DraggableBlockListProps> = ({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
  onReorderBlocks
}) => {
  return (
    <DragDropContext onDragEnd={onReorderBlocks}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    <BlockRenderer
                      block={block}
                      index={index}
                      onChange={(data) => onUpdateBlock(index, data)}
                      onDelete={() => onRemoveBlock(index)}
                      onMoveUp={() => {}}
                      onMoveDown={() => {}}
                      canMoveUp={false}
                      canMoveDown={false}
                      dragHandleProps={provided.dragHandleProps}
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
