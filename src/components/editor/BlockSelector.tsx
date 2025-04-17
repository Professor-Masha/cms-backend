
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BlockType } from '@/types/cms';
import { 
  Type, 
  Image, 
  List, 
  Quote, 
  Heading, 
  Code, 
  Table, 
  MessageSquare, 
  Layout, 
  Check, 
  Calendar, 
  Video, 
  Music, 
  Map, 
  Menu,
  Link,
  Columns,
  Rows,
  PanelLeft,
  Square,
  LayoutGrid,
  SplitSquareHorizontal,
  SplitSquareVertical,
} from 'lucide-react';

// Using Square icon from lucide-react as a ButtonIcon replacement
const ButtonIcon = ({ size }: { size: number }) => <Square size={size} />;

interface BlockSelectorProps {
  onSelectBlock: (blockType: BlockType) => void;
  searchTerm?: string;
  showColumnVariants?: boolean;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({ 
  onSelectBlock, 
  searchTerm = '',
  showColumnVariants = false
}) => {
  const [activeTab, setActiveTab] = useState('core');

  const coreBlocks: Array<{ type: BlockType; name: string; description: string; icon: React.ReactNode }> = [
    { type: 'paragraph', name: 'Paragraph', description: 'Rich formatted text with advanced options', icon: <Type size={18} /> },
    { type: 'text', name: 'Text', description: 'Simple text content', icon: <Type size={18} /> },
    { type: 'heading', name: 'Heading', description: 'H1-H6 titles', icon: <Heading size={18} /> },
    { type: 'list', name: 'List', description: 'Bulleted or numbered list', icon: <List size={18} /> },
    { type: 'quote', name: 'Quote', description: 'Quotation or testimonial', icon: <Quote size={18} /> },
    { type: 'button', name: 'Button', description: 'Call-to-action button', icon: <ButtonIcon size={18} /> },
    { type: 'divider', name: 'Divider', description: 'Horizontal separator', icon: <Menu size={18} /> },
  ];

  const mediaBlocks: Array<{ type: BlockType; name: string; description: string; icon: React.ReactNode }> = [
    { type: 'image', name: 'Image', description: 'Single image with caption', icon: <Image size={18} /> },
    { type: 'gallery', name: 'Gallery', description: 'Multiple images as grid', icon: <Image size={18} /> },
    { type: 'video', name: 'Video', description: 'Embedded video player', icon: <Video size={18} /> },
    { type: 'audio', name: 'Audio', description: 'Audio player', icon: <Music size={18} /> },
    { type: 'hero', name: 'Hero Banner', description: 'Full-width media banner', icon: <Image size={18} /> },
    { type: 'embed', name: 'Embed', description: 'Embed external content', icon: <Link size={18} /> },
    { type: 'code', name: 'Code', description: 'Syntax-highlighted code', icon: <Code size={18} /> },
    { type: 'social', name: 'Social Media', description: 'Links or icons', icon: <MessageSquare size={18} /> },
    { type: 'map', name: 'Map', description: 'Location map', icon: <Map size={18} /> },
  ];
  
  const layoutBlocks: Array<{ type: BlockType; name: string; description: string; icon: React.ReactNode }> = [
    { type: 'columns', name: 'Columns', description: 'Multi-column layout', icon: <Columns size={18} /> },
    { type: 'group', name: 'Group', description: 'Group content blocks', icon: <PanelLeft size={18} /> },
    { type: 'row', name: 'Row', description: 'Horizontal layout', icon: <Layout size={18} /> },
    { type: 'stack', name: 'Stack', description: 'Vertical layout', icon: <Rows size={18} /> },
  ];

  const advancedBlocks: Array<{ type: BlockType; name: string; description: string; icon: React.ReactNode }> = [
    { type: 'form', name: 'Form', description: 'Contact or signup form', icon: <MessageSquare size={18} /> },
    { type: 'table', name: 'Table', description: 'Tabular data', icon: <Table size={18} /> },
    { type: 'accordion', name: 'Accordion', description: 'Collapsible content', icon: <Menu size={18} /> },
    { type: 'html', name: 'HTML', description: 'Custom HTML content', icon: <Code size={18} /> },
    { type: 'calendar', name: 'Calendar', description: 'Event calendar', icon: <Calendar size={18} /> },
    { type: 'search', name: 'Search', description: 'Search form', icon: <Menu size={18} /> },
    { type: 'recentPosts', name: 'Recent Posts', description: 'Display recent posts', icon: <List size={18} /> },
  ];
  
  const columnVariants = [
    { id: 'col-100', name: '100', layout: [100], icon: <div className="w-full h-6 border-2 border-primary rounded flex items-center justify-center"><div className="w-4/5 h-3 bg-primary/30 rounded"></div></div> },
    { id: 'col-50-50', name: '50/50', layout: [50, 50], icon: <div className="w-full h-6 border-2 border-primary rounded flex"><div className="w-1/2 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/2 h-full bg-primary/30"></div></div> },
    { id: 'col-33-66', name: '33/66', layout: [33, 66], icon: <div className="w-full h-6 border-2 border-primary rounded flex"><div className="w-1/3 h-full bg-primary/30 border-r border-primary"></div><div className="w-2/3 h-full bg-primary/30"></div></div> },
    { id: 'col-66-33', name: '66/33', layout: [66, 33], icon: <div className="w-full h-6 border-2 border-primary rounded flex"><div className="w-2/3 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/3 h-full bg-primary/30"></div></div> },
    { id: 'col-33-33-33', name: '33/33/33', layout: [33, 33, 33], icon: <div className="w-full h-6 border-2 border-primary rounded flex"><div className="w-1/3 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/3 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/3 h-full bg-primary/30"></div></div> },
    { id: 'col-25-50-25', name: '25/50/25', layout: [25, 50, 25], icon: <div className="w-full h-6 border-2 border-primary rounded flex"><div className="w-1/4 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/2 h-full bg-primary/30 border-r border-primary"></div><div className="w-1/4 h-full bg-primary/30"></div></div> },
  ];

  const allBlocks = [...coreBlocks, ...mediaBlocks, ...layoutBlocks, ...advancedBlocks];

  const filteredBlocks = useMemo(() => {
    if (!searchTerm) {
      return {
        core: coreBlocks,
        media: mediaBlocks,
        layout: layoutBlocks,
        advanced: advancedBlocks
      };
    }

    const term = searchTerm.toLowerCase();
    return {
      core: coreBlocks.filter(block => 
        block.name.toLowerCase().includes(term) || 
        block.description.toLowerCase().includes(term)
      ),
      media: mediaBlocks.filter(block => 
        block.name.toLowerCase().includes(term) || 
        block.description.toLowerCase().includes(term)
      ),
      layout: layoutBlocks.filter(block => 
        block.name.toLowerCase().includes(term) || 
        block.description.toLowerCase().includes(term)
      ),
      advanced: advancedBlocks.filter(block => 
        block.name.toLowerCase().includes(term) || 
        block.description.toLowerCase().includes(term)
      )
    };
  }, [searchTerm]);

  const renderBlockList = (blocks: typeof coreBlocks) => {
    return blocks.map((block) => (
      <button
        key={block.type}
        className="w-full text-left p-2 hover:bg-muted rounded-md flex items-start"
        onClick={() => onSelectBlock(block.type)}
      >
        <div className="mr-2 mt-0.5 text-muted-foreground">{block.icon}</div>
        <div>
          <div className="font-medium">{block.name}</div>
          <div className="text-sm text-muted-foreground">{block.description}</div>
        </div>
      </button>
    ));
  };

  // If showing column variants, render the column layout options
  if (showColumnVariants) {
    return (
      <div className="p-4">
        <h3 className="font-medium mb-2">Select a variation to start with:</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {columnVariants.map((variant) => (
            <div key={variant.id} className="flex flex-col items-center">
              <button 
                className="p-2 hover:bg-muted rounded-md border-2 border-muted hover:border-primary mb-1"
                onClick={() => onSelectBlock({ 
                  type: 'columns', 
                  variant: variant.id, 
                  layout: variant.layout 
                } as any)}
              >
                {variant.icon}
              </button>
              <span className="text-xs text-center">{variant.name}</span>
            </div>
          ))}
        </div>
        <div className="text-right">
          <Button variant="ghost" size="sm" onClick={() => onSelectBlock({ type: 'columns', skip: true } as any)}>
            Skip
          </Button>
        </div>
      </div>
    );
  }

  // If searching, show all matched blocks in one list
  if (searchTerm) {
    const allMatched = allBlocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      block.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (allMatched.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No blocks match your search.
        </div>
      );
    }
    
    return (
      <div className="max-h-60 overflow-y-auto">
        {renderBlockList(allMatched)}
      </div>
    );
  }

  return (
    <Tabs defaultValue="core" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="core">Text</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="advanced">Widgets</TabsTrigger>
      </TabsList>
      
      <div className="max-h-60 overflow-y-auto">
        <TabsContent value="core" className="space-y-2">
          {renderBlockList(filteredBlocks.core)}
        </TabsContent>
        
        <TabsContent value="media" className="space-y-2">
          {renderBlockList(filteredBlocks.media)}
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-2">
          {renderBlockList(filteredBlocks.layout)}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-2">
          {renderBlockList(filteredBlocks.advanced)}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default BlockSelector;
