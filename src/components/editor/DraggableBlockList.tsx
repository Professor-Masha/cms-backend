
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Block, BlockType } from '@/types/cms';
import BlockRenderer from './BlockRenderer';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface DraggableBlockListProps {
  blocks: Block[];
  onUpdateBlock: (index: number, data: any) => void;
  onRemoveBlock: (index: number) => void;
  onReorderBlocks: (result: any) => void;
  onAddBlock: (blockType: BlockType | any, afterIndex?: number) => void;
}

const DraggableBlockList: React.FC<DraggableBlockListProps> = ({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
  onReorderBlocks,
  onAddBlock,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const { toast } = useToast();

  // Clear multi-selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if the click was outside any block
      if (
        selectedBlocks.length > 0 &&
        !(e.target as Element).closest('.draggable-block')
      ) {
        setSelectedBlocks([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBlocks]);

  const handleBlockSelect = (index: number) => {
    // Check if Shift key is pressed
    if (window.event && (window.event as KeyboardEvent).shiftKey) {
      setSelectedBlocks(prev => {
        if (prev.includes(index)) {
          return prev.filter(idx => idx !== index);
        } else {
          return [...prev, index];
        }
      });
    } else {
      setSelectedBlockIndex(index);
      setSelectedBlocks([]);
    }
  };

  const handleTransformBlocks = (type: string, config?: any) => {
    if (selectedBlocks.length < 2) {
      toast({
        title: "Select multiple blocks",
        description: "Please select at least two blocks to transform",
        variant: "destructive",
      });
      return;
    }

    // Sort selected blocks by index to maintain correct order
    const sortedIndices = [...selectedBlocks].sort((a, b) => a - b);
    const blocksToTransform = sortedIndices.map(index => blocks[index]);

    if (type === 'group') {
      // Create a group block
      const groupBlock: Block = {
        id: `temp-${uuidv4()}`,
        article_id: blocks[0].article_id,
        type: 'group',
        order: sortedIndices[0],
        data: {
          blocks: blocksToTransform,
          label: 'Block Group',
          style: 'default'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Remove the original blocks
      const updatedBlocks = blocks.filter((_, index) => !sortedIndices.includes(index));
      
      // Insert the group block at the position of the first selected block
      updatedBlocks.splice(sortedIndices[0], 0, groupBlock);
      
      // Reindex the blocks
      const reindexedBlocks = updatedBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));
      
      // Update with the custom result
      onReorderBlocks({
        source: { index: -1 },
        destination: { index: -1 },
        customBlocks: reindexedBlocks,
      });
      
      // Clear the selection
      setSelectedBlocks([]);
      setSelectedBlockIndex(sortedIndices[0]);
      
      toast({
        title: "Blocks grouped",
        description: `${blocksToTransform.length} blocks were grouped successfully`,
      });
    } else if (type === 'columns') {
      // Create columns layout with the config
      const columnsBlock: Block = {
        id: `temp-${uuidv4()}`,
        article_id: blocks[0].article_id,
        type: 'columns',
        order: sortedIndices[0],
        data: {
          columns: createColumnsFromLayout(config?.layout || [50, 50], blocksToTransform),
          gapSize: 'medium',
          stackOnMobile: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Remove the original blocks
      const updatedBlocks = blocks.filter((_, index) => !sortedIndices.includes(index));
      
      // Insert the columns block at the position of the first selected block
      updatedBlocks.splice(sortedIndices[0], 0, columnsBlock);
      
      // Reindex the blocks
      const reindexedBlocks = updatedBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));
      
      // Update with the custom result
      onReorderBlocks({
        source: { index: -1 },
        destination: { index: -1 },
        customBlocks: reindexedBlocks,
      });
      
      // Clear the selection
      setSelectedBlocks([]);
      setSelectedBlockIndex(sortedIndices[0]);
      
      toast({
        title: "Blocks transformed to columns",
        description: `${blocksToTransform.length} blocks were placed in a ${config?.layout.length}-column layout`,
      });
    }
  };

  // Helper function to create columns data structure from layout config
  const createColumnsFromLayout = (layout: number[], blocksToPlace: Block[]) => {
    // Ensure layout percentages add up to 100
    const totalWidth = layout.reduce((sum, width) => sum + width, 0);
    const normalizedLayout = layout.map(width => Math.round((width / totalWidth) * 100));

    // Create column data
    const columns = normalizedLayout.map((width, i) => ({
      id: `col-${uuidv4()}`,
      width,
      blocks: [] as Block[],
    }));

    // Distribute blocks across columns
    if (blocksToPlace.length <= columns.length) {
      // Place one block per column (from the start)
      blocksToPlace.forEach((block, i) => {
        columns[i].blocks.push(block);
      });
    }
    else {
      // Distribute blocks evenly across columns
      const blocksPerColumn = Math.ceil(blocksToPlace.length / columns.length);
      blocksToPlace.forEach((block, i) => {
        const columnIndex = Math.min(
          Math.floor(i / blocksPerColumn), columns.length - 1);
        columns[columnIndex].blocks.push(block);
      });
    }
    
    return columns;
  };

  const handleReorderColumnBlocks = (result: any, columnId: string) => {
    // Reorder blocks within a specific column
    if (result.destination && result.source) {
      const updatedBlocks = [...blocks];
      const columnIndex = updatedBlocks.findIndex(block => block.data.columns?.find((col: any) => col.id === columnId));

      if (columnIndex !== -1) {
        const columnToUpdate = updatedBlocks[columnIndex].data.columns.find((col: any) => col.id === columnId);
        const [reorderedBlock] = columnToUpdate.blocks.splice(result.source.index, 1);
        columnToUpdate.blocks.splice(result.destination.index, 0, reorderedBlock);

        // Update the blocks with the reordered column data
        onReorderBlocks({
          source: { index: -1 },
          destination: { index: -1 },
          customBlocks: updatedBlocks,
        });
      }
    }
  };
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
                    className="mb-4 draggable-block"
                    {...provided.dragHandleProps}
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
                          id: `temp-${uuidv4()}`,
                          data: duplicatedData,
                        };
                        onReorderBlocks({
                          source: { index: -1 },
                          destination: { index: index + 1 },
                          duplicatedBlock,
                        });
                        setSelectedBlockIndex(index + 1);
                      }}
                      onAddBlock={(blockType, afterIndex) => onAddBlock(blockType, afterIndex)}
                      onTransformBlocks={handleTransformBlocks}
                      canMoveUp={index > 0}
                      canMoveDown={index < blocks.length - 1}
                      isSelected={selectedBlockIndex === index}
                      isMultiSelected={selectedBlocks.includes(index)}
                      onSelect={() => handleBlockSelect(index)}
                      onReorderColumnBlocks={(result, columnId) => handleReorderColumnBlocks(result, columnId)}
                      
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
