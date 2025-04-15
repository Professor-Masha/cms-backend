
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
  // Define the function to render the droppable content
  const renderDroppableContent = (provided: any) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="space-y-4"
    >
      {blocks.map((block, index) => (
        <Draggable key={block.id} draggableId={block.id} index={index}>
          {(dragProvided, snapshot) => (
            <div
              ref={dragProvided.innerRef}
              {...dragProvided.draggableProps}
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
                dragHandleProps={dragProvided.dragHandleProps}
              />
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  );

  return (
    <DragDropContext onDragEnd={onReorderBlocks}>
      <Droppable droppableId="blocks">
        {renderDroppableContent}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableBlockList;
