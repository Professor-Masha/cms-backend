
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContainerClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('click', handleContainerClick);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleContainerClick);
      }
    };
  }, []);

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (!tag) return;
    
    // Don't add duplicate tags
    if (value.includes(tag)) return;
    
    // Don't exceed max tags
    if (value.length >= maxTags) return;
    
    onChange([...value, tag]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue) {
      addTag(inputValue);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
    >
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1 h-7">
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeTag(index)}
          >
            <X size={12} />
            <span className="sr-only">Remove {tag}</span>
          </Button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 p-0 h-7"
      />
    </div>
  );
};

export default TagsInput;
