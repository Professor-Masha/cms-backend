import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify, 
  Bold, 
  Italic, 
  Link, 
  Highlighter, 
  Code, 
  Superscript, 
  Subscript, 
  Strikethrough, 
  Heading1, 
  Type,
  Image,
  Keyboard,
  BookmarkPlus,
  Languages,
  ArrowUpWideNarrow
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParagraphBlockProps {
  data: {
    content: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
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
    footnotes?: {
      id: string;
      content: string;
    }[];
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
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');
  const [showInlineImageInput, setShowInlineImageInput] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [inlineImageWidth, setInlineImageWidth] = useState('100');
  const [inlineImageAlt, setInlineImageAlt] = useState('');
  const [showFootnoteInput, setShowFootnoteInput] = useState(false);
  const [footnoteContent, setFootnoteContent] = useState('');
  const [showLanguageInput, setShowLanguageInput] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  const commonLanguages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'code', label: 'Code' },
  ];
  
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
      case 'kbd':
        formattedText = `<kbd>${formattedText}</kbd>`;
        break;
      case 'uppercase':
        formattedText = formattedText.toUpperCase();
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

  const applyHighlight = () => {
    if (!selectedText) return;
    
    const formattedText = `<span style="color:${textColor};background-color:${bgColor};">${selectedText.text}</span>`;
    const newContent = 
      data.content.substring(0, selectedText.start) + 
      formattedText + 
      data.content.substring(selectedText.end);
    
    onChange({ ...data, content: newContent });
    setSelectedText(null);
    setShowHighlightPicker(false);
  };

  const insertInlineImage = () => {
    if (!selectedText && !inlineImageUrl) return;
    
    const formattedText = `<img src="${inlineImageUrl}" alt="${inlineImageAlt}" width="${inlineImageWidth}" style="display:inline;vertical-align:middle;" />`;
    
    let newContent;
    if (selectedText) {
      newContent = 
        data.content.substring(0, selectedText.start) + 
        formattedText + 
        data.content.substring(selectedText.end);
    } else {
      const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || data.content.length;
      newContent = 
        data.content.substring(0, cursorPos) + 
        formattedText + 
        data.content.substring(cursorPos);
    }
    
    onChange({ ...data, content: newContent });
    setSelectedText(null);
    setInlineImageUrl('');
    setInlineImageAlt('');
    setInlineImageWidth('100');
    setShowInlineImageInput(false);
  };

  const insertFootnote = () => {
    if (!selectedText || !footnoteContent) return;
    
    const footnoteId = `footnote-${Date.now()}`;
    
    const footnoteReference = `<sup><a href="#${footnoteId}" id="${footnoteId}-ref">[${(data.footnotes?.length || 0) + 1}]</a></sup>`;
    
    const newContent = 
      data.content.substring(0, selectedText.end) + 
      footnoteReference + 
      data.content.substring(selectedText.end);
    
    const newFootnotes = [...(data.footnotes || []), {
      id: footnoteId,
      content: footnoteContent
    }];
    
    onChange({ 
      ...data, 
      content: newContent,
      footnotes: newFootnotes
    });
    
    setSelectedText(null);
    setFootnoteContent('');
    setShowFootnoteInput(false);
  };

  const applyLanguage = () => {
    if (!selectedText || !selectedLanguage) return;
    
    const formattedText = `<span lang="${selectedLanguage}">${selectedText.text}</span>`;
    const newContent = 
      data.content.substring(0, selectedText.start) + 
      formattedText + 
      data.content.substring(selectedText.end);
    
    onChange({ ...data, content: newContent });
    setSelectedText(null);
    setSelectedLanguage('');
    setShowLanguageInput(false);
  };

  const commonColors = [
    { text: '#000000', bg: '#ffff00' },
    { text: '#ffffff', bg: '#ff0000' },
    { text: '#ffffff', bg: '#0000ff' },
    { text: '#ffffff', bg: '#008000' },
    { text: '#000000', bg: '#ffffff' },
    { text: '#ffffff', bg: '#000000' },
    { text: '#9b87f5', bg: 'transparent' },
    { text: '#F97316', bg: 'transparent' },
    { text: '#0EA5E9', bg: 'transparent' },
    { text: '#fff', bg: '#9b87f5' },
    { text: '#fff', bg: '#F97316' },
    { text: '#fff', bg: '#0EA5E9' },
  ];

  const placeholderImages = [
    { url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', desc: 'Gray laptop computer' },
    { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', desc: 'Monitor showing code' },
    { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', desc: 'Person using MacBook Pro' },
    { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1', desc: 'Gray and black laptop on surface' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', desc: 'Laptop on glass table' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 mb-2">
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
                className={`h-8 w-8 ${data.alignment === 'justify' ? 'bg-accent' : ''}`}
                onClick={() => onChange({...data, alignment: 'justify'})}
              >
                <AlignJustify size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Justify</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
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
                onClick={() => applyTextFormat('uppercase')}
                disabled={!selectedText}
              >
                <ArrowUpWideNarrow size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Uppercase</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={!selectedText}
            >
              <Highlighter size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Highlight (Text Color)</h4>
              <Tabs defaultValue="text">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="text" className="flex-1">Text Color</TabsTrigger>
                  <TabsTrigger value="background" className="flex-1">Background</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {commonColors.map((color, index) => (
                        <div 
                          key={`text-${index}`} 
                          className={`w-6 h-6 rounded-full cursor-pointer border ${textColor === color.text ? 'ring-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color.text }}
                          onClick={() => setTextColor(color.text)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-text-color">Custom</Label>
                      <Input 
                        id="custom-text-color" 
                        type="color" 
                        value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 p-1"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="background">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {commonColors.map((color, index) => (
                        <div 
                          key={`bg-${index}`} 
                          className={`w-6 h-6 rounded-full cursor-pointer border ${bgColor === color.bg ? 'ring-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color.bg }}
                          onClick={() => setBgColor(color.bg)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-bg-color">Custom</Label>
                      <Input 
                        id="custom-bg-color" 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 p-1"
                      />
                    </div>
                    <div className="mt-2 p-2 border rounded">
                      <p style={{ backgroundColor: bgColor, color: textColor, padding: '8px' }}>
                        Preview text
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={applyHighlight}>Apply Highlight</Button>
            </div>
          </PopoverContent>
        </Popover>
        
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => applyTextFormat('kbd')}
                disabled={!selectedText}
              >
                <Keyboard size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Keyboard Input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Popover open={showFootnoteInput} onOpenChange={setShowFootnoteInput}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={!selectedText}
            >
              <BookmarkPlus size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Add Footnote</h4>
              <div className="space-y-2">
                <Label htmlFor="footnote-content">Footnote Text</Label>
                <Textarea 
                  id="footnote-content" 
                  placeholder="Enter footnote content..." 
                  value={footnoteContent}
                  onChange={(e) => setFootnoteContent(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button 
                onClick={insertFootnote}
                disabled={!footnoteContent.trim()}
              >
                Add Footnote
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showLanguageInput} onOpenChange={setShowLanguageInput}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={!selectedText}
            >
              <Languages size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Set Language</h4>
              <div className="space-y-2">
                <Label htmlFor="language-select">Select Language</Label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={applyLanguage}
                disabled={!selectedLanguage}
              >
                Apply Language
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
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

        <Popover open={showInlineImageInput} onOpenChange={setShowInlineImageInput}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
            >
              <Image size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Insert Inline Image</h4>
              
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input 
                  id="image-url" 
                  placeholder="https://example.com/image.jpg" 
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input 
                  id="image-alt" 
                  placeholder="Image description" 
                  value={inlineImageAlt}
                  onChange={(e) => setInlineImageAlt(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-width">Width (px)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="image-width" 
                    type="number" 
                    value={inlineImageWidth}
                    onChange={(e) => setInlineImageWidth(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sample Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {placeholderImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer border rounded p-1 hover:bg-accent"
                      onClick={() => {
                        setInlineImageUrl(img.url);
                        setInlineImageAlt(img.desc);
                      }}
                    >
                      <img 
                        src={img.url} 
                        alt={img.desc} 
                        className="w-full h-12 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={insertInlineImage}>Insert Image</Button>
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
          backgroundColor: data.backgroundColor || 'inherit',
          textAlign: data.alignment || 'left'
        }}
      />
      
      {data.footnotes && data.footnotes.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Footnotes:</h4>
          <ol className="list-decimal list-inside text-sm space-y-1 pl-2">
            {data.footnotes.map((footnote, index) => (
              <li key={footnote.id} id={footnote.id} className="text-muted-foreground">
                <a href={`#${footnote.id}-ref`} className="text-primary hover:underline">[{index + 1}]</a> {footnote.content}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ParagraphBlock;
