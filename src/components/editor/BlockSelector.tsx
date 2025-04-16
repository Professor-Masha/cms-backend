
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockType } from '@/types/cms';
import { PlusIcon } from 'lucide-react';

interface BlockSelectorProps {
  onSelectBlock: (blockType: BlockType) => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({ onSelectBlock }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (blockType: BlockType) => {
    onSelectBlock(blockType);
    setOpen(false);
  };

  const coreBlocks: Array<{ type: BlockType; name: string; description: string }> = [
    { type: 'paragraph', name: 'Paragraph', description: 'Rich formatted text with advanced options' },
    { type: 'text', name: 'Text', description: 'Simple text content' },
    { type: 'heading', name: 'Heading', description: 'H1-H6 titles' },
    { type: 'list', name: 'List', description: 'Bulleted or numbered list' },
    { type: 'quote', name: 'Quote', description: 'Quotation or testimonial' },
    { type: 'button', name: 'Button', description: 'Call-to-action button' },
    { type: 'divider', name: 'Divider', description: 'Horizontal separator' },
  ];

  const mediaBlocks: Array<{ type: BlockType; name: string; description: string }> = [
    { type: 'image', name: 'Image', description: 'Single image with caption' },
    { type: 'gallery', name: 'Gallery', description: 'Multiple images as grid' },
    { type: 'video', name: 'Video', description: 'Embedded video player' },
    { type: 'audio', name: 'Audio', description: 'Audio player' },
    { type: 'hero', name: 'Hero Banner', description: 'Full-width media banner' },
    { type: 'embed', name: 'Embed', description: 'Embed external content' },
    { type: 'code', name: 'Code', description: 'Syntax-highlighted code' },
    { type: 'social', name: 'Social Media', description: 'Links or icons' },
    { type: 'map', name: 'Map', description: 'Location map' },
  ];
  
  const layoutBlocks: Array<{ type: BlockType; name: string; description: string }> = [
    { type: 'columns', name: 'Columns', description: 'Multi-column layout' },
    { type: 'group', name: 'Group', description: 'Group content blocks' },
    { type: 'row', name: 'Row', description: 'Horizontal layout' },
    { type: 'stack', name: 'Stack', description: 'Vertical layout' },
  ];

  const advancedBlocks: Array<{ type: BlockType; name: string; description: string }> = [
    { type: 'form', name: 'Form', description: 'Contact or signup form' },
    { type: 'table', name: 'Table', description: 'Tabular data' },
    { type: 'accordion', name: 'Accordion', description: 'Collapsible content' },
    { type: 'html', name: 'HTML', description: 'Custom HTML content' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon size={16} />
          Add Block
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="center">
        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="core" className="space-y-2">
            {coreBlocks.map((block) => (
              <button
                key={block.type}
                className="w-full text-left p-2 hover:bg-muted rounded-md flex items-start"
                onClick={() => handleSelect(block.type)}
              >
                <div>
                  <div className="font-medium">{block.name}</div>
                  <div className="text-sm text-muted-foreground">{block.description}</div>
                </div>
              </button>
            ))}
          </TabsContent>
          
          <TabsContent value="media" className="space-y-2">
            {mediaBlocks.map((block) => (
              <button
                key={block.type}
                className="w-full text-left p-2 hover:bg-muted rounded-md flex items-start"
                onClick={() => handleSelect(block.type)}
              >
                <div>
                  <div className="font-medium">{block.name}</div>
                  <div className="text-sm text-muted-foreground">{block.description}</div>
                </div>
              </button>
            ))}
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-2">
            {layoutBlocks.map((block) => (
              <button
                key={block.type}
                className="w-full text-left p-2 hover:bg-muted rounded-md flex items-start"
                onClick={() => handleSelect(block.type)}
              >
                <div>
                  <div className="font-medium">{block.name}</div>
                  <div className="text-sm text-muted-foreground">{block.description}</div>
                </div>
              </button>
            ))}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-2">
            {advancedBlocks.map((block) => (
              <button
                key={block.type}
                className="w-full text-left p-2 hover:bg-muted rounded-md flex items-start"
                onClick={() => handleSelect(block.type)}
              >
                <div>
                  <div className="font-medium">{block.name}</div>
                  <div className="text-sm text-muted-foreground">{block.description}</div>
                </div>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default BlockSelector;
