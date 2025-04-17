
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';

interface TextBlockProps {
  data: {
    content: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
  onChange: (data: any) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ data, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize the textarea to fit content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data.content]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onChange({ ...data, content: newContent });
    
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };
  
  const textAlignmentClass = data.alignment ? `text-${data.alignment}` : '';
  
  return (
    <Textarea
      ref={textareaRef}
      className={`min-h-[100px] w-full border-none bg-transparent shadow-none focus-visible:ring-0 resize-none ${textAlignmentClass}`}
      value={data.content}
      onChange={handleInputChange}
      placeholder="Start writing here..."
      rows={1}
    />
  );
};

export default TextBlock;
