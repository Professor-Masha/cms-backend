import React, { useState } from 'react';
import { Block } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  AlignJustify,
  Group,
  Plus,
  LayoutGrid,
  Columns,
  SplitSquareHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TextBlock from './blocks/TextBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
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
import BlockSelector from './BlockSelector';
import ColumnsBlock from './blocks/ColumnsBlock';

interface BlockRendererProps {
  block: Block;
  index: number;
  onChange: (data: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate?: () => void;
  onGroup?: () => void;
  onAddBlock?: (blockType: string, afterIndex: number) => void;
  onTransformBlocks?: (type: string, config?: any) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isSelected: boolean;
  isMultiSelected?: boolean;
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
  onAddBlock,
  onTransformBlocks,
  canMoveUp,
  canMoveDown,
  isSelected,
  isMultiSelected = false,
  onSelect,
  dragHandleProps
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlock data={block.data} onChange={onChange} />;
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
        return <ColumnsBlock data={block.data} onChange={onChange} />;
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

  const renderAlignmentTools = () => {
    if (block.type !== 'text' && block.type !== 'heading' && block.type !== 'paragraph') {
      return null;
    }
    
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onChange({...block.data, alignment: 'left'})}
              >
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onChange({...block.data, alignment: 'center'})}
              >
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onChange({...block.data, alignment: 'right'})}
              >
                <AlignRight size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Right</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onChange({...block.data, alignment: 'justify'})}
              >
                <AlignJustify size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Justify</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  };

  const handleInsertBlock = (blockType: any) => {
    if (onAddBlock) {
      onAddBlock(blockType, index);
      setShowBlockMenu(false);
    }
  };

  const handleColumnsSelectorClick = (data: any) => {
    if (data.skip) {
      setShowColumnSelector(false);
      return;
    }
    
    if (onTransformBlocks && data.variant) {
      const config = {
        layout: data.layout,
        variant: data.variant
      };
      onTransformBlocks('columns', config);
      setShowColumnSelector(false);
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover open={showBlockMenu} onOpenChange={setShowBlockMenu}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md bg-white hover:bg-gray-100"
            >
              <Plus size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="center">
            <BlockSelector onSelectBlock={handleInsertBlock} />
          </PopoverContent>
        </Popover>
      </div>
    
      <Card 
        className={`transition-all border-2 ${isMultiSelected ? 'border-blue-500' : isSelected ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
        onClick={(e) => {
          if (e.shiftKey) {
            onSelect();
          } else if (!isMultiSelected) {
            onSelect();
          }
        }}
      >
        <div className="flex">
          <div 
            className={`w-10 flex-shrink-0 flex flex-col items-center py-3 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <div {...dragHandleProps} className="cursor-grab p-1">
              <GripVertical className="text-muted-foreground" size={16} />
            </div>
          </div>
          
          <div className="flex-grow py-3 pr-3">
            {renderBlockContent()}
          </div>
        </div>
      </Card>
      
      {isMultiSelected && onTransformBlocks && (
        <div className="absolute -left-10 top-2 flex flex-col gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 bg-white"
              >
                <SplitSquareHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <h3 className="px-2 py-1 text-xs font-bold text-muted-foreground">TRANSFORM TO</h3>
              <DropdownMenuItem onClick={() => setShowColumnSelector(true)}>
                <Columns className="mr-2 h-4 w-4" />
                <span>Columns</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTransformBlocks('group')}>
                <Group className="mr-2 h-4 w-4" />
                <span>Group</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      <Popover open={showColumnSelector} onOpenChange={setShowColumnSelector}>
        <PopoverContent className="w-80 p-0" side="left">
          <BlockSelector 
            onSelectBlock={handleColumnsSelectorClick} 
            showColumnVariants={true}
          />
        </PopoverContent>
      </Popover>
      
      {isSelected && !isMultiSelected && (
        <div className="absolute -right-10 top-2 flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  className="h-8 w-8 bg-white"
                >
                  <ChevronUp size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Move Up</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  className="h-8 w-8 bg-white"
                >
                  <ChevronDown size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Move Down</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onDuplicate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={onDuplicate}
                    className="h-8 w-8 bg-white"
                  >
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Duplicate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Popover open={showSettings} onOpenChange={setShowSettings}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 bg-white"
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
                  variant="outline" 
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 bg-white text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
