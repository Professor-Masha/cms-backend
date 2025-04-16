
import { Textarea } from '@/components/ui/textarea';

interface TextBlockProps {
  data: {
    content: string;
  };
  onChange: (data: any) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ data, onChange }) => {
  console.log('Rendering TextBlock with data:', data);
  
  return (
    <Textarea
      className="min-h-[100px]"
      value={data.content}
      onChange={(e) => onChange({ ...data, content: e.target.value })}
      placeholder="Enter text content here..."
    />
  );
};

export default TextBlock;
