
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Block } from '@/types/cms';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  AlignVerticalSpaceAround as AlignTop,
  AlignVerticalJustifyCenter as AlignMiddle,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';

interface ColumnsBlockProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      blocks: Block[];
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
  // Preview component to show a visual representation of columns
  const ColumnsPreview = () => (
    <div className="flex gap-4 mb-4 h-24 bg-gray-50 rounded-lg p-4">
      {data.columns.map((column, index) => (
        <div
          key={column.id}
          style={{ width: `${column.width}%` }}
          className="bg-gray-200 rounded flex items-center justify-center"
        >
          <span className="text-sm text-gray-600">Column {index + 1}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-medium mb-4">Columns Layout</h3>
        <ColumnsPreview />
        
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Number of Columns ({data.columns.length})</Label>
            <Slider
              value={[data.columns.length]}
              min={1}
              max={6}
              step={1}
              onValueChange={([value]) => {
                const currentColumns = [...data.columns];
                const columnWidth = Math.floor(100 / value);
                
                if (value > currentColumns.length) {
                  // Add columns
                  while (currentColumns.length < value) {
                    currentColumns.push({
                      id: `col-${Date.now()}-${currentColumns.length}`,
                      width: columnWidth,
                      blocks: []
                    });
                  }
                } else {
                  // Remove columns
                  currentColumns.splice(value);
                }
                
                // Adjust widths to be equal
                currentColumns.forEach(col => col.width = columnWidth);
                
                onChange({
                  ...data,
                  columns: currentColumns
                });
              }}
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-2 block">Gap Size</Label>
            <Select 
              value={data.gapSize}
              onValueChange={(value: 'small' | 'medium' | 'large') => 
                onChange({ ...data, gapSize: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gap size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Stack on Mobile</Label>
            <Switch
              checked={data.stackOnMobile}
              onCheckedChange={(checked) => onChange({ ...data, stackOnMobile: checked })}
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium mb-4">Alignment</h3>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Vertical Alignment</Label>
            <div className="flex gap-2">
              <Button
                variant={data.verticalAlignment === 'top' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, verticalAlignment: 'top' })}
              >
                <AlignTop className="h-4 w-4" />
              </Button>
              <Button
                variant={data.verticalAlignment === 'middle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, verticalAlignment: 'middle' })}
              >
                <AlignMiddle className="h-4 w-4" />
              </Button>
              <Button
                variant={data.verticalAlignment === 'bottom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, verticalAlignment: 'bottom' })}
              >
                <AlignTop className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Horizontal Alignment</Label>
            <div className="flex gap-2">
              <Button
                variant={data.horizontalAlignment === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, horizontalAlignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={data.horizontalAlignment === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, horizontalAlignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={data.horizontalAlignment === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, horizontalAlignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant={data.horizontalAlignment === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, horizontalAlignment: 'justify' })}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Block Width</Label>
            <div className="flex gap-2">
              <Button
                variant={data.width === 'none' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, width: 'none' })}
              >
                <Columns2 className="h-4 w-4" />
              </Button>
              <Button
                variant={data.width === 'wide' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, width: 'wide' })}
              >
                <Columns3 className="h-4 w-4" />
              </Button>
              <Button
                variant={data.width === 'full' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, width: 'full' })}
              >
                <Columns4 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium mb-4">Advanced</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="html-anchor">HTML Anchor</Label>
            <Input
              id="html-anchor"
              value={data.htmlAnchor || ''}
              onChange={(e) => onChange({ ...data, htmlAnchor: e.target.value })}
              placeholder="Enter anchor ID"
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
