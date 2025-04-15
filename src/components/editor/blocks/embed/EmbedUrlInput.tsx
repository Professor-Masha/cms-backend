
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EmbedUrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onValidate?: (isValid: boolean) => void;
}

const EmbedUrlInput: React.FC<EmbedUrlInputProps> = ({ 
  url, 
  onUrlChange,
  onValidate 
}) => {
  const [inputValue, setInputValue] = useState<string>(url || '');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Update internal state when prop changes
  useEffect(() => {
    setInputValue(url || '');
  }, [url]);
  
  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear any existing timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    // Set a new timeout to validate
    const timeout = setTimeout(() => {
      validateAndUpdateUrl(newValue);
    }, 1000); // 1 second delay
    
    setValidationTimeout(timeout as unknown as NodeJS.Timeout);
  };
  
  const validateAndUpdateUrl = (value: string) => {
    if (!value.trim()) {
      onUrlChange('');
      if (onValidate) onValidate(false);
      return;
    }
    
    setIsValidating(true);
    
    // Simple validation for URL format
    let formattedUrl = value;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // More sophisticated validation could be done here
    // For now we're just doing basic format checks
    const isValidUrl = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(formattedUrl);
    
    if (isValidUrl) {
      // Update the input to show the formatted URL
      setInputValue(formattedUrl);
      // Notify parent
      onUrlChange(formattedUrl);
      if (onValidate) onValidate(true);
    } else {
      // Still update with the user's value, but mark as invalid
      onUrlChange(value);
      if (onValidate) onValidate(false);
    }
    
    setIsValidating(false);
  };
  
  const handleApply = () => {
    validateAndUpdateUrl(inputValue);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="embed-url">URL</Label>
      <div className="flex gap-2">
        <Input
          id="embed-url"
          value={inputValue}
          onChange={handleChange}
          placeholder="https://example.com/embed"
          className="flex-1"
        />
        <Button 
          onClick={handleApply}
          disabled={isValidating}
          type="button"
          size="sm"
        >
          {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter the URL of the content you want to embed
      </p>
    </div>
  );
};

export default EmbedUrlInput;
