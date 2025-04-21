import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Block } from '@/types/cms';
import { Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface ColumnsBlockProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      widthUnit?: string;
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
  };
  onChange: (data: any) => void;
}

// Maps gap size to Tailwind utility
const gapMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'gap-2',
  medium: 'gap-6',
  large: 'gap-12',
};

const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ data, onChange }) => {
  // Helper: responsive stacking
  const getColumnClass = (width: number, widthUnit?: string) => {
    // Default unit is %, but allow px, rem, em, vw, vh as well
    const twWidth = widthUnit && widthUnit !== '%' ? undefined : `basis-[${width}%]`;
    return [
      twWidth,
      'flex-1 min-w-0', // Shrink or grow nicely
    ].filter(Boolean).join(' ');
  };

  // Helper: get classes for alignment
  const getAlignmentClass = () => {
    let justify = '';
    switch (data.horizontalAlignment) {
      case 'left': justify = 'justify-start'; break;
      case 'center': justify = 'justify-center'; break;
      case 'right': justify = 'justify-end'; break;
      case 'justify': justify = 'justify-between'; break;
      default: justify = '';
    }
    let items = '';
    switch (data.verticalAlignment) {
      case 'top': items = 'items-start'; break;
      case 'middle': items = 'items-center'; break;
      case 'bottom': items = 'items-end'; break;
      default: items = '';
    }
    return `${justify} ${items}`;
  };

  // Extra: support block width ("full", "wide", "none/content")
  const blockWidthClass = () => {
    switch (data.width) {
      case 'wide':
        return 'max-w-[1200px] mx-auto w-full';
      case 'full':
        return 'w-full';
      case 'none':
      default:
        return 'max-w-4xl mx-auto w-full';
    }
  };

  // Style settings
  const blockStyle: React.CSSProperties = {
    background: data.backgroundColor || undefined,
    color: data.textColor || undefined,
    padding: data.padding || undefined,
    margin: data.margin || undefined,
    border: data.border?.width ? `${data.border.width}px ${data.border.style || 'solid'} ${data.border.color || '#dedede'}` : undefined,
    borderRadius: data.border?.radius ? `${data.border.radius}px` : undefined,
  };

  // Handle update for a single column
  const updateColumn = (idx: number, colChanges: any) => {
    const columns = data.columns.map((col: any, i: number) =>
      i === idx ? { ...col, ...colChanges } : col
    );
    onChange({ ...data, columns });
  };

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
            <div className="flex items-center space-x-2 mb-3">
              <Button size="icon" variant="outline"
                onClick={() => {
                  if (data.columns.length > 1) {
                    onChange({ ...data, columns: data.columns.slice(0, -1) });
                  }
                }}
                disabled={data.columns.length <= 1}
              >-</Button>
              <Input
                style={{ width: 40, textAlign: 'center' }}
                type="number"
                min={1}
                max={6}
                value={data.columns.length}
                onChange={e => {
                  let value = Number(e.target.value);
                  if (value > 6) value = 6;
                  if (value < 1) value = 1;
                  let columns = [...data.columns];
                  const colWidth = Math.floor(100 / value);
                  if (value > columns.length) {
                    // Add new empty columns.
                    while (columns.length < value) {
                      columns.push({
                        id: `col-${Date.now()}-${columns.length}`,
                        width: colWidth,
                        widthUnit: '%',
                        blocks: [],
                      });
                    }
                  } else {
                    columns = columns.slice(0, value);
                  }
                  columns = columns.map((col, i) => ({ ...col, width: colWidth }));
                  onChange({ ...data, columns });
                }}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  if (data.columns.length < 6) {
                    // Add one
                    const colWidth = Math.floor(100 / (data.columns.length + 1));
                    onChange({
                      ...data,
                      columns: [
                        ...data.columns,
                        {
                          id: `col-${Date.now()}-${data.columns.length}`,
                          width: colWidth,
                          widthUnit: '%',
                          blocks: [],
                        },
                      ].map((col: any, i: number, arr: any[]) => ({
                        ...col,
                        width: Math.floor(100 / arr.length),
                      })),
                    });
                  }
                }}
                disabled={data.columns.length >= 6}
              >+</Button>
              <span className="ml-2 text-xs text-muted-foreground">up to 6</span>
            </div>
          </div>

          <div>
            <Label className="mt-4 mb-2 block">Column Widths & Units:</Label>
            {data.columns.map((col: any, idx: number) => (
              <div key={col.id} className="flex space-x-2 items-center mb-2">
                <span className="w-10 text-xs text-muted-foreground">Col {idx + 1}</span>
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={col.width}
                  style={{ width: 64 }}
                  onChange={e => {
                    updateColumn(idx, { width: Number(e.target.value) });
                  }}
                />
                <Select value={col.widthUnit || '%'} onValueChange={val => updateColumn(idx, { widthUnit: val })}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['%', 'px', 'em', 'rem', 'vw', 'vh'].map(u => (
                      <SelectItem value={u} key={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
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
                <AlignLeft className="h-4 w-4 -rotate-90" />
              </Button>
              <Button
                variant={data.verticalAlignment === 'middle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, verticalAlignment: 'middle' })}
              >
                <AlignCenter className="h-4 w-4 -rotate-90" />
              </Button>
              <Button
                variant={data.verticalAlignment === 'bottom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, verticalAlignment: 'bottom' })}
              >
                <AlignRight className="h-4 w-4 -rotate-90" />
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
                None
              </Button>
              <Button
                variant={data.width === 'wide' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, width: 'wide' })}
              >
                Wide
              </Button>
              <Button
                variant={data.width === 'full' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...data, width: 'full' })}
              >
                Full
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
