
import React from 'react';
import { Block } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react';
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

interface BlockRendererProps {
  block: Block;
  index: number;
  onChange: (data: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  index,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
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
      default:
        return (
          <div className="p-4 text-muted-foreground border border-dashed rounded-md">
            Block type "{block.type}" not implemented yet
          </div>
        );
    }
  };

  return (
    <Card>
      <div className="bg-muted p-2 rounded-t-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted-foreground" size={16} />
          <span className="text-sm font-medium capitalize">{block.type} Block</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="h-8 w-8"
          >
            <ArrowUp size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="h-8 w-8"
          >
            <ArrowDown size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <CardContent className="pt-4">
        {renderBlockContent()}
      </CardContent>
    </Card>
  );
};

export default BlockRenderer;
