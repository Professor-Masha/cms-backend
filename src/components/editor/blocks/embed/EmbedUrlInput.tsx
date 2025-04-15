
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface EmbedUrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
}

const EmbedUrlInput: React.FC<EmbedUrlInputProps> = ({ url, onUrlChange }) => {
  const [inputValue, setInputValue] = useState<string>(url || '');
  
  // Update internal state when prop changes
  useEffect(() => {
    setInputValue(url || '');
  }, [url]);
  
  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update parent component after short delay
    onUrlChange(newValue);
  };
  
  return (
    <div>
      <Label htmlFor="embed-url">URL</Label>
      <Input
        id="embed-url"
        value={inputValue}
        onChange={handleChange}
        placeholder="https://example.com/embed"
        className="mt-1"
      />
    </div>
  );
};

export default EmbedUrlInput;
