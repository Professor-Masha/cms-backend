import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Block } from '@/types/cms';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  AlignTop, 
  AlignMiddle, 
  AlignBottom,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Group,
  Ungroup,
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColumnsBlockProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      blocks: Block[];
      alignment?: string;
      backgroundColor?: string;
      textColor?: string;
      linkColor?: string;
      padding?: string;
      margin?: string;
      border?: {
        color?: string;
        style?: string;
        width?: number;
        radius?: number;
      };
    }>;
    gapSize: 'small' | 'medium' | 'large';
    stackOnMobile: boolean;
    verticalAlignment: 'top' | 'middle' | 'bottom';
    horizontalAlignment: 'left' | 'center' | 'right' | 'justify';
    width: 'none' | 'wide' | 'full';
    htmlAnchor?: string;
    cssClasses?: string;
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
    const currentColumns = [...data.columns];
    const currentWidth = currentColumns[columnIndex].width;
    const difference = width - currentWidth;
    
    if (difference > 0) {
      const otherColumns = currentColumns.filter((_, i) => i !== columnIndex);
      const totalOtherWidth = otherColumns.reduce((sum, col) => sum + col.width, 0);
      
      currentColumns[columnIndex].width = width;
      
      otherColumns.forEach((col, i) => {
        const otherIndex = currentColumns.findIndex(c => c.id === col.id);
        const reductionRatio = col.width / totalOtherWidth;
        currentColumns[otherIndex].width = Math.max(5, col.width - (difference * reductionRatio));
      });
    } 
    else if (difference < 0) {
      const otherColumns = currentColumns.filter((_, i) => i !== columnIndex);
      const totalOtherWidth = otherColumns.reduce((sum, col) => sum + col.width, 0);
      
      currentColumns[columnIndex].width = width;
      
      otherColumns.forEach((col, i) => {
        const otherIndex = currentColumns.findIndex(c => c.id === col.id);
        const increaseRatio = col.width / totalOtherWidth;
        currentColumns[otherIndex].width = col.width + (Math.abs(difference) * increaseRatio);
      });
    }
    
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

  const handleVerticalAlignmentChange = (alignment: 'top' | 'middle' | 'bottom') => {
    onChange({
      ...data,
      verticalAlignment: alignment
    });
  };

  const handleHorizontalAlignmentChange = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    onChange({
      ...data,
      horizontalAlignment: alignment
    });
  };

  const handleWidthChange = (width: 'none' | 'wide' | 'full') => {
    onChange({
      ...data,
      width
    });
  };

  const handleColumnStyleChange = (columnIndex: number, key: string, value: any) => {
    const updatedColumns = [...data.columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      [key]: value
    };
    
    onChange({
      ...data,
      columns: updatedColumns
    });
  };

  const handleAddColumn = () => {
    if (data.columns.length >= 6) return;
    
    const newColumn = {
      id: `col-${Date.now()}`,
      width: Math.floor(100 / (data.columns.length + 1)),
      blocks: [],
    };
    
    const updatedColumns = [...data.columns, newColumn].map(col => ({
      ...col,
      width: Math.floor(100 / (data.columns.length + 1))
    }));
    
    onChange({
      ...data,
      columns: updatedColumns
    });
  };

  const handleRemoveColumn = (index: number) => {
    if (data.columns.length <= 1) return;
    
    const updatedColumns = data.columns.filter((_, i) => i !== index).map(col => ({
      ...col,
      width: Math.floor(100 / (data.columns.length - 1))
    }));
    
    onChange({
      ...data,
      columns: updatedColumns
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Number of Columns ({data.columns.length}/6)</Label>
          <div className="flex space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddColumn}
              disabled={data.columns.length >= 6}
            >
              Add Column
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRemoveColumn(data.columns.length - 1)}
              disabled={data.columns.length <= 1}
            >
              Remove Column
            </Button>
          </div>
        </div>
        <div>
          <Label>Stack on Mobile</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              checked={data.stackOnMobile}
              onCheckedChange={(checked) => onChange({ ...data, stackOnMobile: checked })}
            />
            <span className="text-sm text-muted-foreground">
              Stack columns vertically on mobile devices
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Width</Label>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.width === 'none' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleWidthChange('none')}
                  >
                    <Columns2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Normal width (max 650px)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.width === 'wide' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleWidthChange('wide')}
                  >
                    <Columns3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wide width (max 1200px)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.width === 'full' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleWidthChange('full')}
                  >
                    <Columns4 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full width</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex justify-between">
          <Label>Vertical Alignment</Label>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.verticalAlignment === 'top' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleVerticalAlignmentChange('top')}
                  >
                    <AlignTop className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.verticalAlignment === 'middle' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleVerticalAlignmentChange('middle')}
                  >
                    <AlignMiddle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align middle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.verticalAlignment === 'bottom' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleVerticalAlignmentChange('bottom')}
                  >
                    <AlignBottom className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align bottom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex justify-between">
          <Label>Text Alignment</Label>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.horizontalAlignment === 'left' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleHorizontalAlignmentChange('left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.horizontalAlignment === 'center' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleHorizontalAlignmentChange('center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align center</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.horizontalAlignment === 'right' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleHorizontalAlignmentChange('right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={data.horizontalAlignment === 'justify' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleHorizontalAlignmentChange('justify')}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Justify text</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4">
        <p className="text-sm font-medium mb-4">Columns Layout</p>
        <div 
          className={`flex ${data.stackOnMobile ? 'flex-col sm:flex-row' : 'flex-row'} items-stretch gap-${data.gapSize === 'small' ? '2' : data.gapSize === 'medium' ? '4' : '6'}`}
          style={{
            alignItems: data.verticalAlignment === 'top' ? 'flex-start' : 
                       data.verticalAlignment === 'bottom' ? 'flex-end' : 'center'
          }}
        >
          {data.columns.map((column, index) => (
            <div 
              key={column.id}
              className="border border-dashed rounded p-3 flex-1 min-h-[120px]"
              style={{ 
                width: `${column.width}%`,
                textAlign: data.horizontalAlignment as any,
                backgroundColor: column.backgroundColor,
                color: column.textColor,
                padding: column.padding,
                margin: column.margin,
                borderColor: column.border?.color,
                borderStyle: column.border?.style as any,
                borderWidth: column.border?.width,
                borderRadius: column.border?.radius
              }}
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
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold">Advanced Settings</h3>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="html-anchor">HTML Anchor</Label>
            <Input
              id="html-anchor"
              value={data.htmlAnchor || ''}
              onChange={(e) => onChange({ ...data, htmlAnchor: e.target.value })}
              placeholder="Enter anchor ID"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a word or two — without spaces — to make a unique web address for this block
            </p>
          </div>
          
          <div>
            <Label htmlFor="css-classes">Additional CSS Classes</Label>
            <Input
              id="css-classes"
              value={data.cssClasses || ''}
              onChange={(e) => onChange({ ...data, cssClasses: e.target.value })}
              placeholder="Enter CSS classes"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple classes with spaces
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnsBlock;
