
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";

interface ColumnsBlockSettingsProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      widthUnit?: string;
      blocks: any[];
    }>;
    gapSize: 'small' | 'medium' | 'large';
    stackOnMobile: boolean;
    columnAlignment?: 'left' | 'center' | 'right' | 'justify';
    contentAlignment?: 'left' | 'center' | 'right' | 'justify';
  };
  onChange: (data: any) => void;
}

const ColumnsBlockSettings: React.FC<ColumnsBlockSettingsProps> = ({ data, onChange }) => {
  // Handle changing the number of columns
  const handleAddColumn = () => {
    const newColumn = {
      id: `col-${Date.now()}`,
      width: 100 / (data.columns.length + 1),
      widthUnit: '%',
      blocks: []
    };
    
    // Adjust all column widths to be equal
    const columns = [...data.columns, newColumn].map(col => ({
      ...col,
      width: 100 / (data.columns.length + 1)
    }));
    
    onChange({ ...data, columns });
  };

  const handleRemoveColumn = (index: number) => {
    if (data.columns.length <= 1) return;
    
    const columns = [...data.columns];
    columns.splice(index, 1);
    
    // Redistribute widths evenly
    const updatedColumns = columns.map(col => ({
      ...col,
      width: 100 / columns.length
    }));
    
    onChange({ ...data, columns: updatedColumns });
  };

  // Handle column width change
  const handleColumnWidthChange = (index: number, width: number) => {
    const columns = [...data.columns];
    columns[index] = { ...columns[index], width };
    onChange({ ...data, columns });
  };

  // Handle width unit change
  const handleWidthUnitChange = (index: number, widthUnit: string) => {
    const columns = [...data.columns];
    columns[index] = { ...columns[index], widthUnit };
    onChange({ ...data, columns });
  };

  // Handle gap size change
  const handleGapSizeChange = (value: 'small' | 'medium' | 'large') => {
    onChange({ ...data, gapSize: value });
  };

  // Handle stack on mobile toggle
  const handleStackOnMobileChange = () => {
    onChange({ ...data, stackOnMobile: !data.stackOnMobile });
  };

  // Handle alignment changes
  const handleColumnAlignmentChange = (value: 'left' | 'center' | 'right' | 'justify') => {
    onChange({ ...data, columnAlignment: value });
  };

  const handleContentAlignmentChange = (value: 'left' | 'center' | 'right' | 'justify') => {
    onChange({ ...data, contentAlignment: value });
  };

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="layout">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-2">
            <Label>Columns</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Number of columns: {data.columns.length}</span>
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddColumn}
                >
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={data.columns.length <= 1}
                  onClick={() => handleRemoveColumn(data.columns.length - 1)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Column Widths</Label>
            {data.columns.map((column, index) => (
              <div key={column.id} className="grid grid-cols-4 gap-2 items-center">
                <Badge variant="outline" className="col-span-1">Column {index + 1}</Badge>
                <Input
                  type="number"
                  min={1}
                  max={column.widthUnit === '%' ? 100 : 1000}
                  value={column.width}
                  onChange={(e) => handleColumnWidthChange(index, Number(e.target.value))}
                  className="col-span-2"
                />
                <Select 
                  value={column.widthUnit || '%'} 
                  onValueChange={(value) => handleWidthUnitChange(index, value)}
                >
                  <SelectTrigger className="col-span-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="em">em</SelectItem>
                    <SelectItem value="rem">rem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Gap Size</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={data.gapSize === 'small' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleGapSizeChange('small')}
              >
                Small
              </Button>
              <Button 
                variant={data.gapSize === 'medium' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleGapSizeChange('medium')}
              >
                Medium
              </Button>
              <Button 
                variant={data.gapSize === 'large' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleGapSizeChange('large')}
              >
                Large
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="alignment" className="space-y-4">
          <div className="space-y-2">
            <Label>Column Alignment</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant={data.columnAlignment === 'left' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleColumnAlignmentChange('left')}
              >
                <AlignLeft className="mr-2 h-4 w-4" />
                Left
              </Button>
              <Button 
                variant={data.columnAlignment === 'center' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleColumnAlignmentChange('center')}
              >
                <AlignCenter className="mr-2 h-4 w-4" />
                Center
              </Button>
              <Button 
                variant={data.columnAlignment === 'right' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleColumnAlignmentChange('right')}
              >
                <AlignRight className="mr-2 h-4 w-4" />
                Right
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Content Alignment</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant={data.contentAlignment === 'left' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleContentAlignmentChange('left')}
              >
                <AlignLeft className="mr-2 h-4 w-4" />
                Left
              </Button>
              <Button 
                variant={data.contentAlignment === 'center' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleContentAlignmentChange('center')}
              >
                <AlignCenter className="mr-2 h-4 w-4" />
                Center
              </Button>
              <Button 
                variant={data.contentAlignment === 'right' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleContentAlignmentChange('right')}
              >
                <AlignRight className="mr-2 h-4 w-4" />
                Right
              </Button>
              <Button 
                variant={data.contentAlignment === 'justify' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handleContentAlignmentChange('justify')}
              >
                <AlignJustify className="mr-2 h-4 w-4" />
                Justify
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={data.stackOnMobile ? 'default' : 'outline'}
              onClick={handleStackOnMobileChange}
            >
              {data.stackOnMobile ? 'Stack On Mobile: On' : 'Stack On Mobile: Off'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColumnsBlockSettings;
