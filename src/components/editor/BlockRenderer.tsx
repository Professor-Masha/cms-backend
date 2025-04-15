import React, { useState } from 'react';
import { Block } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trash2, 
  GripVertical, 
  ChevronUp, 
  ChevronDown,
  Settings,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Group
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TextBlock from './blocks/TextBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ImageBlock from './blocks/ImageBlock';
import ListBlock from './blocks/ListBlock';
import QuoteBlock from './blocks/QuoteBlock';
import VideoBlock from './blocks/VideoBlock';
import AudioBlock from './blocks/AudioBlock';
import GalleryBlock from './blocks/GalleryBlock';
import CodeBlock from './blocks/CodeBlock';
import DividerBlock from './blocks/DividerBlock';
import ButtonBlock from './blocks/ButtonBlock';
import HeroBlock from './blocks/HeroBlock';
import EmbedBlock from './blocks/EmbedBlock';
import SocialBlock from './blocks/SocialBlock';
import MapBlock from './blocks/MapBlock';
import AccordionBlock from './blocks/AccordionBlock';
import HtmlBlock from './blocks/HtmlBlock';
import TableBlock from './blocks/TableBlock';
import BlockSettings from './BlockSettings';
import GroupBlock from './blocks/GroupBlock';

interface BlockRendererProps {
  block: Block;
  index: number;
  onChange: (data: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate?: () => void;
  onGroup?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isSelected: boolean;
  onSelect: () => void;
  dragHandleProps?: any;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  index,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onGroup,
  canMoveUp,
  canMoveDown,
  isSelected,
  onSelect,
  dragHandleProps
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock data={block.data} onChange={onChange} />;
      case 'heading':
        return <HeadingBlock data={block.data} onChange={onChange} />;
      case 'image':
        return <ImageBlock data={block.data} onChange={onChange} />;
      case 'gallery':
        return <GalleryBlock data={block.data} onChange={onChange} />;
      case 'list':
        return <ListBlock data={block.data} onChange={onChange} />;
      case 'quote':
        return <QuoteBlock data={block.data} onChange={onChange} />;
      case 'video':
        return <VideoBlock data={block.data} onChange={onChange} />;
      case 'audio':
        return <AudioBlock data={block.data} onChange={onChange} />;
      case 'code':
        return <CodeBlock data={block.data} onChange={onChange} />;
      case 'divider':
        return <DividerBlock data={block.data} onChange={onChange} />;
      case 'button':
        return <ButtonBlock data={block.data} onChange={onChange} />;
      case 'hero':
        return <HeroBlock data={block.data} onChange={onChange} />;
      case 'embed':
        return <EmbedBlock data={block.data} onChange={onChange} />;
      case 'social':
        return <SocialBlock data={block.data} onChange={onChange} />;
      case 'map':
        return <MapBlock data={block.data} onChange={onChange} />;
      case 'accordion':
        return <AccordionBlock data={block.data} onChange={onChange} />;
      case 'html':
        return <HtmlBlock data={block.data} onChange={onChange} />;
      case 'table':
        return <TableBlock data={block.data} onChange={onChange} />;
      case 'group':
        return <GroupBlock data={block.data} onChange={onChange} />;
      case 'columns':
      case 'row':
      case 'stack':
        return (
          <div className="p-4 text-muted-foreground border border-dashed rounded-md">
            {block.type} layout block (coming soon)
          </div>
        );
      default:
        return (
          <div className="p-4 text-muted-foreground border border-dashed rounded-md">
            Block type "{block.type}" not implemented yet
          </div>
        );
    }
  };

  const renderBlockToolbar = () => {
    const commonTools = (
      <>
        {block.type === 'text' || block.type === 'heading' ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange({...block.data, alignment: 'left'})}>
                    <AlignLeft size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align Left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange({...block.data, alignment: 'center'})}>
                    <AlignCenter size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align Center</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange({...block.data, alignment: 'right'})}>
                    <AlignRight size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align Right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : null}
      </>
    );
    
    return commonTools;
  };

  return (
    <Card 
      className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="bg-muted p-2 rounded-t-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps}>
            <GripVertical className="text-muted-foreground cursor-grab" size={16} />
          </div>
          <span className="text-sm font-medium capitalize">{block.type} Block</span>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-1">
            {renderBlockToolbar()}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                    className="h-8 w-8"
                  >
                    <ChevronUp size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move Up</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                    className="h-8 w-8"
                  >
                    <ChevronDown size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move Down</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {onDuplicate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onDuplicate}
                      className="h-8 w-8"
                    >
                      <Copy size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onGroup && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onGroup}
                      className="h-8 w-8"
                    >
                      <Group size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Group</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                >
                  <Settings size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <BlockSettings 
                  block={block} 
                  onChange={onChange} 
                />
              </PopoverContent>
            </Popover>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onDelete}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        {renderBlockContent()}
      </CardContent>
    </Card>
  );
};

export default BlockRenderer;
