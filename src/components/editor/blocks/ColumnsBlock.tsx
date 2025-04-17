
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/cms';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface ColumnsBlockProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      blocks: Block[];
    }>;
    gapSize: 'small' | 'medium' | 'large';
    stackOnMobile: boolean;
  };
  onChange: (data: any) => void;
}

const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ data, onChange }) => {
  const handleGapSizeChange = (value: string) => {
    onChange({
      ...data,
      gapSize: value
    });
  };

  const handleStackOnMobileChange = (checked: boolean) => {
    onChange({
      ...data,
      stackOnMobile: checked
    });
  };

  const handleColumnWidthChange = (columnIndex: number, width: number) => {
    // Adjust the widths of other columns to maintain 100% total
    const currentColumns = [...data.columns];
    const currentWidth = currentColumns[columnIndex].width;
    const difference = width - currentWidth;
    
    // If increasing width, decrease others proportionally
    if (difference > 0) {
      const otherColumns = currentColumns.filter((_, i) => i !== columnIndex);
      const totalOtherWidth = otherColumns.reduce((sum, col) => sum + col.width, 0);
      
      currentColumns[columnIndex].width = width;
      
      // Distribute the reduction proportionally
      otherColumns.forEach((col, i) => {
        const otherIndex = currentColumns.findIndex(c => c.id === col.id);
        const reductionRatio = col.width / totalOtherWidth;
        currentColumns[otherIndex].width = Math.max(5, col.width - (difference * reductionRatio));
      });
    } 
    // If decreasing width, increase others proportionally
    else if (difference < 0) {
      const otherColumns = currentColumns.filter((_, i) => i !== columnIndex);
      const totalOtherWidth = otherColumns.reduce((sum, col) => sum + col.width, 0);
      
      currentColumns[columnIndex].width = width;
      
      // Distribute the increase proportionally
      otherColumns.forEach((col, i) => {
        const otherIndex = currentColumns.findIndex(c => c.id === col.id);
        const increaseRatio = col.width / totalOtherWidth;
        currentColumns[otherIndex].width = col.width + (Math.abs(difference) * increaseRatio);
      });
    }
    
    // Normalize to ensure they sum to exactly 100
    const totalWidth = currentColumns.reduce((sum, col) => sum + col.width, 0);
    const normalizedColumns = currentColumns.map(col => ({
      ...col,
      width: Math.round((col.width / totalWidth) * 100)
    }));
    
    onChange({
      ...data,
      columns: normalizedColumns
    });
  };

  const handleReorderColumnBlocks = (columnIndex: number, result: DropResult) => {
    if (!result.destination) return;
    
    const updatedColumns = [...data.columns];
    const column = {...updatedColumns[columnIndex]};
    const blocks = [...column.blocks];
    
    const [movedBlock] = blocks.splice(result.source.index, 1);
    blocks.splice(result.destination.index, 0, movedBlock);
    
    column.blocks = blocks;
    updatedColumns[columnIndex] = column;
    
    onChange({
      ...data,
      columns: updatedColumns
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <Label htmlFor="gap-size">Gap Size</Label>
          <Select value={data.gapSize} onValueChange={handleGapSizeChange}>
            <SelectTrigger id="gap-size">
              <SelectValue placeholder="Select gap size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch 
            id="stack-on-mobile" 
            checked={data.stackOnMobile}
            onCheckedChange={handleStackOnMobileChange}
          />
          <Label htmlFor="stack-on-mobile">Stack on mobile</Label>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <p className="text-sm font-medium mb-4">Columns Layout</p>
        <div className="flex items-center gap-4 mb-6" style={{gap: data.gapSize === 'small' ? '8px' : data.gapSize === 'medium' ? '16px' : '24px'}}>
          {data.columns.map((column, index) => (
            <div 
              key={column.id}
              className="border border-dashed rounded p-3 flex-1 min-h-[120px]"
              style={{ width: `${column.width}%` }}
            >
              <div className="text-sm font-medium mb-2 flex justify-between items-center">
                <span>Column {index + 1}</span>
                <span className="text-xs text-muted-foreground">{column.width}%</span>
              </div>
              
              <Label htmlFor={`column-${index}-width`} className="text-xs mb-1 block">Width</Label>
              <Slider
                id={`column-${index}-width`}
                value={[column.width]}
                min={10}
                max={90}
                step={5}
                className="mb-4"
                onValueChange={(values) => handleColumnWidthChange(index, values[0])}
              />
              
              {column.blocks && column.blocks.length > 0 ? (
                <DragDropContext onDragEnd={(result) => handleReorderColumnBlocks(index, result)}>
                  <Droppable droppableId={`column-${column.id}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-1"
                      >
                        {column.blocks.map((block, blockIdx) => (
                          <Draggable key={block.id} draggableId={block.id} index={blockIdx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-muted p-2 rounded-md text-xs"
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
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground">No blocks in this column</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="bg-muted w-4 h-4 rounded"></div>
          <span>Preview of column proportions</span>
        </div>
      </div>
    </div>
  );
};

export default ColumnsBlock;
