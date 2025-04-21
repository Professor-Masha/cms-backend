
import React from 'react';
import {
  Input,
  Label,
  Slider,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Button,
} from '@/components/ui';
import { Block } from '@/types/cms';

// Column width units supported
const widthUnits = ['%', 'px', 'em', 'rem', 'vw', 'vh'];

interface ColumnsBlockSettingsProps {
  data: any;
  onChange: (data: any) => void;
}

const ColumnsBlockSettings: React.FC<ColumnsBlockSettingsProps> = ({ data, onChange }) => {
  // Handle update for a single column
  const updateColumn = (idx: number, colChanges: any) => {
    const columns = data.columns.map((col: any, i: number) =>
      i === idx ? { ...col, ...colChanges } : col
    );
    onChange({ ...data, columns });
  };

  return (
    <div className="p-4 border-t mt-4 bg-background rounded">
      <h4 className="text-md font-semibold mb-2">Columns Block Settings</h4>
      <Label className="mb-2 block">Number of Columns</Label>
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
              {widthUnits.map(u => (
                <SelectItem value={u} key={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <Label className="mt-4 mb-2 block">Gap Size</Label>
      <Select value={data.gapSize} onValueChange={v => onChange({ ...data, gapSize: v })}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Small</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="large">Large</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 mt-4">
        <Label>Stack Columns On Mobile</Label>
        <Switch checked={data.stackOnMobile} onCheckedChange={v => onChange({ ...data, stackOnMobile: v })} />
      </div>

      <Label className="mb-2 mt-4 block">Vertical Alignment</Label>
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

      <Label className="mb-2 mt-4 block">Horizontal Alignment</Label>
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

      <Label className="mb-2 mt-4 block">Block Width</Label>
      <div className="flex gap-2 mb-6">
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

      <div className="mt-6">
        <Label>HTML Anchor</Label>
        <Input
          value={data.htmlAnchor || ''}
          onChange={e => onChange({ ...data, htmlAnchor: e.target.value })}
          placeholder="Unique anchor"
        />
      </div>
      <div className="mt-2 mb-2">
        <Label>Additional CSS Classes</Label>
        <Input
          value={data.cssClasses || ''}
          onChange={e => onChange({ ...data, cssClasses: e.target.value })}
          placeholder="e.g. my-columns"
        />
      </div>
    </div>
  );
};

export default ColumnsBlockSettings;
