
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Link, 
  Highlighter, 
  Code, 
  Superscript, 
  Subscript, 
  Strikethrough, 
  Heading1, 
  Type
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParagraphBlockProps {
  data: {
    content: string;
    alignment?: 'left' | 'center' | 'right';
    format?: {
      bold?: boolean;
      italic?: boolean;
      strikethrough?: boolean;
      highlight?: boolean;
      code?: boolean;
      superscript?: boolean;
      subscript?: boolean;
    };
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    cssClass?: string;
  };
  onChange: (data: any) => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ data, onChange }) => {
  const [selectedText, setSelectedText] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);
  
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    
    if (start !== end) {
      setSelectedText({
        start,
        end,
        text: data.content.substring(start, end),
      });
    } else {
      setSelectedText(null);
    }
  };
  
  const applyTextFormat = (format: string) => {
    if (!selectedText) return;
    
    let newContent = data.content;
    let formattedText = selectedText.text;
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${formattedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${formattedText}</em>`;
        break;
      case 'strikethrough':
        formattedText = `<del>${formattedText}</del>`;
        break;
      case 'highlight':
        formattedText = `<mark>${formattedText}</mark>`;
        break;
      case 'code':
        formattedText = `<code>${formattedText}</code>`;
        break;
      case 'superscript':
        formattedText = `<sup>${formattedText}</sup>`;
        break;
      case 'subscript':
        formattedText = `<sub>${formattedText}</sub>`;
        break;
      default:
        break;
    }
    
    newContent = 
      newContent.substring(0, selectedText.start) + 
      formattedText + 
      newContent.substring(selectedText.end);
    
    onChange({ ...data, content: newContent });
    setSelectedText(null);
  };
  
  const applyLink = () => {
    if (!selectedText || !linkUrl) return;
    
    const formattedText = `<a href="${linkUrl}">${selectedText.text}</a>`;
    const newContent = 
      data.content.substring(0, selectedText.start) + 
      formattedText + 
      data.content.substring(selectedText.end);
    
    onChange({ ...data, content: newContent });
    setSelectedText(null);
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${data.alignment === 'left' ? 'bg-accent' : ''}`}
                onClick={() => onChange({...data, alignment: 'left'})}
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
                className={`h-8 w-8 ${data.alignment === 'center' ? 'bg-accent' : ''}`}
                onClick={() => onChange({...data, alignment: 'center'})}
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
                className={`h-8 w-8 ${data.alignment === 'right' ? 'bg-accent' : ''}`}
                onClick={() => onChange({...data, alignment: 'right'})}
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
                onClick={() => applyTextFormat('bold')}
                disabled={!selectedText}
              >
                <Bold size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
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
                onClick={() => applyTextFormat('italic')}
                disabled={!selectedText}
              >
                <Italic size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
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
                onClick={() => applyTextFormat('strikethrough')}
                disabled={!selectedText}
              >
                <Strikethrough size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Strikethrough</p>
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
                onClick={() => applyTextFormat('highlight')}
                disabled={!selectedText}
              >
                <Highlighter size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Highlight</p>
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
                onClick={() => applyTextFormat('code')}
                disabled={!selectedText}
              >
                <Code size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inline code</p>
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
                onClick={() => applyTextFormat('superscript')}
                disabled={!selectedText}
              >
                <Superscript size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Superscript</p>
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
                onClick={() => applyTextFormat('subscript')}
                disabled={!selectedText}
              >
                <Subscript size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Subscript</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={!selectedText}
            >
              <Link size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-url">Link URL</Label>
                <Input 
                  id="link-url" 
                  placeholder="https://example.com" 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <Button onClick={applyLink}>Apply Link</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Textarea
        className={`min-h-[150px] text-${data.alignment || 'left'}`}
        value={data.content}
        onChange={(e) => onChange({ ...data, content: e.target.value })}
        onMouseUp={handleTextSelect}
        placeholder="Start writing..."
        style={{
          fontSize: data.fontSize || 'inherit',
          color: data.textColor || 'inherit',
          backgroundColor: data.backgroundColor || 'inherit'
        }}
      />
    </div>
  );
};

export default ParagraphBlock;
