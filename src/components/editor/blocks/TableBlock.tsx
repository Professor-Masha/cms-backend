
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table as TableIcon, 
  Plus, 
  Trash2, 
  Column, 
  RowsIcon,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Paintbrush
} from 'lucide-react';

interface TableBlockProps {
  data: {
    headers: string[];
    rows: string[][];
    caption?: string;
    style?: 'default' | 'striped' | 'bordered' | 'minimal';
    headerStyle?: 'default' | 'primary' | 'dark' | 'light';
    width?: 'auto' | 'full';
    alignment?: 'left' | 'center' | 'right';
  };
  onChange: (data: any) => void;
}

const TableBlock: React.FC<TableBlockProps> = ({ data, onChange }) => {
  const headers = data.headers || ['Header 1', 'Header 2', 'Header 3'];
  const rows = data.rows || [['Cell 1', 'Cell 2', 'Cell 3'], ['Cell 4', 'Cell 5', 'Cell 6']];
  const style = data.style || 'default';
  const headerStyle = data.headerStyle || 'default';
  const width = data.width || 'full';
  const alignment = data.alignment || 'left';
  
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    
    onChange({
      ...data,
      rows: newRows
    });
  };
  
  const updateHeader = (colIndex: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    
    onChange({
      ...data,
      headers: newHeaders
    });
  };
  
  const addColumn = () => {
    const newHeaders = [...headers, `Header ${headers.length + 1}`];
    
    const newRows = rows.map(row => {
      return [...row, `Cell ${row.length + 1}`];
    });
    
    onChange({
      ...data,
      headers: newHeaders,
      rows: newRows
    });
  };
  
  const removeColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    
    const newHeaders = headers.filter((_, i) => i !== colIndex);
    
    const newRows = rows.map(row => {
      return row.filter((_, i) => i !== colIndex);
    });
    
    onChange({
      ...data,
      headers: newHeaders,
      rows: newRows
    });
  };
  
  const moveColumn = (colIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? colIndex - 1 : colIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= headers.length) return;
    
    const newHeaders = [...headers];
    const temp = newHeaders[colIndex];
    newHeaders[colIndex] = newHeaders[targetIndex];
    newHeaders[targetIndex] = temp;
    
    const newRows = rows.map(row => {
      const newRow = [...row];
      const temp = newRow[colIndex];
      newRow[colIndex] = newRow[targetIndex];
      newRow[targetIndex] = temp;
      return newRow;
    });
    
    onChange({
      ...data,
      headers: newHeaders,
      rows: newRows
    });
  };
  
  const addRow = () => {
    const newRow = headers.map((_, i) => `Cell ${rows.length * headers.length + i + 1}`);
    
    onChange({
      ...data,
      rows: [...rows, newRow]
    });
  };
  
  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    
    const newRows = rows.filter((_, i) => i !== rowIndex);
    
    onChange({
      ...data,
      rows: newRows
    });
  };
  
  const moveRow = (rowIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= rows.length) return;
    
    const newRows = [...rows];
    const temp = newRows[rowIndex];
    newRows[rowIndex] = newRows[targetIndex];
    newRows[targetIndex] = temp;
    
    onChange({
      ...data,
      rows: newRows
    });
  };
  
  const getTableClass = () => {
    const baseClass = "w-full border-collapse";
    const widthClass = width === 'auto' ? 'w-auto' : 'w-full';
    
    switch (style) {
      case 'striped':
        return `${baseClass} ${widthClass} [&_tr:nth-child(even)]:bg-muted`;
      case 'bordered':
        return `${baseClass} ${widthClass} [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border`;
      case 'minimal':
        return `${baseClass} ${widthClass} [&_th]:border-b [&_th]:border-muted-foreground`;
      default:
        return `${baseClass} ${widthClass} [&_th]:border-b [&_td]:border-b [&_th]:border-border [&_td]:border-border`;
    }
  };
  
  const getHeaderClass = () => {
    switch (headerStyle) {
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'dark':
        return 'bg-muted-foreground text-background';
      case 'light':
        return 'bg-muted text-foreground';
      default:
        return 'bg-background text-foreground';
    }
  };
  
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="h-5 w-5 text-primary" />
          <Label>Data Table</Label>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addColumn}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          <Column className="h-3 w-3" />
          Add Column
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addRow}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          <RowsIcon className="h-3 w-3" />
          Add Row
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label>Table Headers</Label>
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {headers.map((header, colIndex) => (
              <div key={colIndex} className="min-w-[200px] flex flex-col space-y-1">
                <div className="flex items-center space-x-1">
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(colIndex, e.target.value)}
                    placeholder={`Header ${colIndex + 1}`}
                    className="flex-1"
                  />
                  
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveColumn(colIndex, 'left')}
                      disabled={colIndex === 0}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveColumn(colIndex, 'right')}
                      disabled={colIndex === headers.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(colIndex)}
                      disabled={headers.length <= 1}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Table Data</Label>
        <div className="overflow-x-auto pb-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2 mb-2">
              {row.map((cell, colIndex) => (
                <Input
                  key={colIndex}
                  value={cell}
                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  placeholder={`Cell ${rowIndex * headers.length + colIndex + 1}`}
                  className="min-w-[200px]"
                />
              ))}
              
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveRow(rowIndex, 'up')}
                  disabled={rowIndex === 0}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveRow(rowIndex, 'down')}
                  disabled={rowIndex === rows.length - 1}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(rowIndex)}
                  disabled={rows.length <= 1}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="table-caption">Caption (optional)</Label>
          <Input
            id="table-caption"
            value={data.caption || ''}
            onChange={(e) => onChange({ ...data, caption: e.target.value })}
            placeholder="Table caption or description"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="table-alignment">Text Alignment</Label>
          <Select 
            value={alignment} 
            onValueChange={(value) => onChange({
              ...data,
              alignment: value as 'left' | 'center' | 'right'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="table-style">Table Style</Label>
          <Select 
            value={style} 
            onValueChange={(value) => onChange({
              ...data,
              style: value as 'default' | 'striped' | 'bordered' | 'minimal'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="striped">Striped Rows</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="table-header-style">Header Style</Label>
          <Select 
            value={headerStyle} 
            onValueChange={(value) => onChange({
              ...data,
              headerStyle: value as 'default' | 'primary' | 'dark' | 'light'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Header Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="table-width">Width</Label>
          <Select 
            value={width} 
            onValueChange={(value) => onChange({
              ...data,
              width: value as 'auto' | 'full'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(headers.length > 0 && rows.length > 0) && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Paintbrush className="h-4 w-4" /> Preview:
          </div>
          
          <div className={`overflow-x-auto ${width === 'auto' ? 'inline-block' : 'w-full'}`}>
            <table className={`${getTableClass()} ${getAlignmentClass()}`}>
              {data.caption && (
                <caption className="caption-top text-sm text-muted-foreground my-2">
                  {data.caption}
                </caption>
              )}
              <thead className={getHeaderClass()}>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="p-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBlock;
