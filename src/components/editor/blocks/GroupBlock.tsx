
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Block } from '@/types/cms';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface GroupBlockProps {
  data: {
    blocks: Block[];
    label: string;
    style: string;
    backgroundColor?: string;
  };
  onChange: (data: any) => void;
}

const GroupBlock: React.FC<GroupBlockProps> = ({ data, onChange }) => {
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(data.backgroundColor || '#ffffff');
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      label: e.target.value
    });
  };

  const handleStyleChange = (value: string) => {
    onChange({
      ...data,
      style: value
    });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      backgroundColor: e.target.value
    });
  };

  const handleReorderBlocks = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(data.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onChange({
      ...data,
      blocks: items
    });
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: data.backgroundColor }}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group-label">Group Label</Label>
          <Input
            id="group-label"
            value={data.label}
            onChange={handleLabelChange}
            placeholder="Enter group label"
          />
        </div>
        <div>
          <Label htmlFor="group-style">Style</Label>
          <Select value={data.style} onValueChange={handleStyleChange}>
            <SelectTrigger id="group-style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="shadow">Shadow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="background-color">Background Color</Label>
          <Input
            type="color"
            id="background-color"
            value={data.backgroundColor || '#ffffff'}
            onChange={handleBackgroundColorChange}
          />
        </div>
      </div>
      
        {data.blocks && data.blocks.length > 0 ? (
          <DragDropContext onDragEnd={handleReorderBlocks}>
            <Droppable droppableId="group-blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {data.blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-muted p-2 rounded-md text-sm"
                        >
                          {block.type} Block
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No blocks in this group yet</p>
          </div>
      </div>
    </div>
  );
};

export default GroupBlock;
