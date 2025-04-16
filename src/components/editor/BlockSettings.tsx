
import React from 'react';
import { Block } from '@/types/cms';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from '@/components/ui/slider';

interface BlockSettingsProps {
  block: Block;
  onChange: (data: any) => void;
}

const BlockSettings: React.FC<BlockSettingsProps> = ({ block, onChange }) => {
  const renderCommonSettings = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="css-class">CSS Class</Label>
        <Input 
          id="css-class" 
          value={block.data.cssClass || ''} 
          onChange={(e) => onChange({ ...block.data, cssClass: e.target.value })}
          placeholder="custom-class" 
        />
      </div>
      
      <div>
        <Label htmlFor="block-id">HTML ID</Label>
        <Input 
          id="block-id" 
          value={block.data.id || ''} 
          onChange={(e) => onChange({ ...block.data, id: e.target.value })}
          placeholder="custom-id" 
        />
      </div>
    </div>
  );
  
  const renderSpacingSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Margin Top (px)</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[block.data.marginTop || 0]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onChange({ ...block.data, marginTop: value[0] })}
            className="flex-1"
          />
          <span className="text-sm">{block.data.marginTop || 0}</span>
        </div>
      </div>
      
      <div>
        <Label>Margin Bottom (px)</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[block.data.marginBottom || 0]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onChange({ ...block.data, marginBottom: value[0] })}
            className="flex-1"
          />
          <span className="text-sm">{block.data.marginBottom || 0}</span>
        </div>
      </div>
      
      <div>
        <Label>Padding (px)</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[block.data.padding || 0]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onChange({ ...block.data, padding: value[0] })}
            className="flex-1"
          />
          <span className="text-sm">{block.data.padding || 0}</span>
        </div>
      </div>
    </div>
  );

  const renderTypeSpecificSettings = () => {
    switch (block.type) {
      case 'paragraph':
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Select 
                value={block.data.fontSize || 'normal'} 
                onValueChange={(value) => onChange({ ...block.data, fontSize: value })}
              >
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="text-alignment">Alignment</Label>
              <Select 
                value={block.data.alignment || 'left'} 
                onValueChange={(value) => onChange({ ...block.data, alignment: value })}
              >
                <SelectTrigger id="text-alignment">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <Input 
                id="text-color" 
                type="color" 
                value={block.data.textColor || '#000000'} 
                onChange={(e) => onChange({ ...block.data, textColor: e.target.value })}
                className="h-10 w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="background-color">Background Color</Label>
              <Input 
                id="background-color" 
                type="color" 
                value={block.data.backgroundColor || '#ffffff'} 
                onChange={(e) => onChange({ ...block.data, backgroundColor: e.target.value })}
                className="h-10 w-full"
              />
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[block.data.borderRadius || 0]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(value) => onChange({ ...block.data, borderRadius: value[0] })}
                  className="flex-1"
                />
                <span className="text-sm">{block.data.borderRadius || 0}px</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-width">Width (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[block.data.width || 100]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => onChange({ ...block.data, width: value[0] })}
                  className="flex-1"
                />
                <span className="text-sm">{block.data.width || 100}%</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-alignment">Alignment</Label>
              <Select 
                value={block.data.alignment || 'center'} 
                onValueChange={(value) => onChange({ ...block.data, alignment: value })}
              >
                <SelectTrigger id="image-alignment">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-muted-foreground border border-dashed rounded-md">
            No specific settings for this block type
          </div>
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Block Settings</h3>
      <Separator className="mb-4" />
      
      <Tabs defaultValue="general">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          <TabsTrigger value="spacing" className="flex-1">Spacing</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          {renderTypeSpecificSettings()}
        </TabsContent>
        
        <TabsContent value="spacing">
          {renderSpacingSettings()}
        </TabsContent>
        
        <TabsContent value="advanced">
          {renderCommonSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockSettings;
