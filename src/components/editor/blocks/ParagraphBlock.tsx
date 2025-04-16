
import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import SuperscriptExtension from '@tiptap/extension-superscript';
import SubscriptExtension from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ImageExtension from '@tiptap/extension-image';
import CodeExtension from '@tiptap/extension-code';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify, 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Highlighter, 
  Code as CodeIcon, 
  Superscript, 
  Subscript, 
  Strikethrough,
  Image as ImageIcon,
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
import { Textarea } from '@/components/ui/textarea';

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
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = React.useState(false);
  const [textColor, setTextColor] = React.useState('#000000');
  const [bgColor, setBgColor] = React.useState('#ffff00');
  const [showInlineImageInput, setShowInlineImageInput] = React.useState(false);
  const [inlineImageUrl, setInlineImageUrl] = React.useState('');
  const [inlineImageWidth, setInlineImageWidth] = React.useState('100');
  const [inlineImageAlt, setInlineImageAlt] = React.useState('');
  const [showFootnoteInput, setShowFootnoteInput] = React.useState(false);
  const [footnoteContent, setFootnoteContent] = React.useState('');
  const [showLanguageInput, setShowLanguageInput] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('');
  
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { 
          HTMLAttributes: { 
            class: data.alignment ? `text-${data.alignment}` : 'text-left'
          }
        }
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      SuperscriptExtension,
      SubscriptExtension,
      TextStyle,
      Color,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      CodeExtension,
    ],
    content: data.content || '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      onChange({ 
        ...data, 
        content: editor.getHTML()
      });
    },
  });

  // Update the editor's content when data.content changes
  useEffect(() => {
    if (editor && data.content && editor.getHTML() !== data.content) {
      editor.commands.setContent(data.content);
    }
  }, [editor, data.content]);

  // Update paragraph alignment
  useEffect(() => {
    if (editor && data.alignment) {
      editor.chain().focus().updateAttributes('paragraph', {
        class: `text-${data.alignment}`
      }).run();
    }
  }, [editor, data.alignment]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const applyLink = () => {
    if (!linkUrl) return;
    // Use a different approach to set links since setLink is not available
    editor.chain().focus().extendMarkRange('link')
      .unsetLink()
      .createLink({ href: linkUrl })
      .run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const applyHighlight = () => {
    editor.chain().focus().toggleHighlight({ color: bgColor }).run();
    setShowHighlightPicker(false);
  };

  const insertInlineImage = () => {
    if (!inlineImageUrl) return;
    
    // Use the insertContent method instead of setImage
    editor
      .chain()
      .focus()
      .insertContent(`<img src="${inlineImageUrl}" alt="${inlineImageAlt}" width="${inlineImageWidth}px" style="display:inline;vertical-align:middle;" />`)
      .run();

    setInlineImageUrl('');
    setInlineImageAlt('');
    setInlineImageWidth('100');
    setShowInlineImageInput(false);
  };

  const insertFootnote = () => {
    if (!footnoteContent) return;
    
    const footnoteId = `footnote-${Date.now()}`;
    
    const footnoteReference = `<sup><a href="#${footnoteId}" id="${footnoteId}-ref">[${(data.footnotes?.length || 0) + 1}]</a></sup>`;
    
    editor.chain().focus().insertContent(footnoteReference).run();
    
    const newFootnotes = [...(data.footnotes || []), {
      id: footnoteId,
      content: footnoteContent
    }];
    
    onChange({ 
      ...data, 
      content: editor.getHTML(),
      footnotes: newFootnotes
    });
    
    setFootnoteContent('');
    setShowFootnoteInput(false);
  };

  const applyLanguage = () => {
    if (!selectedLanguage) return;
    
    // Use a different approach since setAttributes is not available
    // First select the text
    editor.chain().focus().extendMarkRange('textStyle')
      // Then apply HTML with the lang attribute
      .insertContent(`<span lang="${selectedLanguage}">${editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ''
      )}</span>`)
      .run();
    
    setSelectedLanguage('');
    setShowLanguageInput(false);
  };

  const applyTextFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'superscript':
        // Use toggleMark instead of toggleSuperscript
        editor.chain().focus().toggleMark('superscript').run();
        break;
      case 'subscript':
        editor.chain().focus().toggleSubscript().run();
        break;
      case 'kbd':
        // Custom for keyboard input - wrap in <kbd> tags
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to, '');
        if (text) {
          editor.chain().focus().insertContent(`<kbd>${text}</kbd>`).run();
        }
        break;
      case 'uppercase':
        // For uppercase, we get the selected text and replace it with its uppercase version
        const selection = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(
          selection.from, 
          selection.to,
          ''
        );
        if (selectedText) {
          editor.chain().focus().insertContent(selectedText.toUpperCase()).run();
        }
        break;
      default:
        break;
    }
  };

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
                className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('bold')}
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
                className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('italic')}
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
                className={`h-8 w-8 ${editor.isActive('strike') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('strikethrough')}
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
              className={`h-8 w-8 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
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
                className={`h-8 w-8 ${editor.isActive('code') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('code')}
              >
                <CodeIcon size={16} />
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
                className={`h-8 w-8 ${editor.isActive('superscript') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('superscript')}
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
                className={`h-8 w-8 ${editor.isActive('subscript') ? 'bg-accent' : ''}`}
                onClick={() => applyTextFormat('subscript')}
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
              className={`h-8 w-8 ${editor.isActive('link') ? 'bg-accent' : ''}`}
            >
              <LinkIcon size={16} />
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
              <ImageIcon size={16} />
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
      
      <div 
        className={`min-h-[150px] border rounded-md p-2 ${data.alignment ? `text-${data.alignment}` : ''}`}
        style={{
          fontSize: data.fontSize || 'inherit',
          color: data.textColor || 'inherit',
          backgroundColor: data.backgroundColor || 'inherit',
        }}
      >
        <EditorContent editor={editor} />
      </div>
      
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
