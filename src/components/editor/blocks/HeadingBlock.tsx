
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeadingBlockProps {
  data: {
    content: string;
    level: string;
  };
  onChange: (data: any) => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select 
          value={data.level}
          onValueChange={(level) => onChange({ ...data, level })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
            <SelectItem value="h5">Heading 5</SelectItem>
            <SelectItem value="h6">Heading 6</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Heading text"
          className="flex-grow"
        />
      </div>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        {data.level === 'h1' && <h1 className="scroll-m-20 text-4xl font-extrabold">{data.content}</h1>}
        {data.level === 'h2' && <h2 className="scroll-m-20 text-3xl font-semibold">{data.content}</h2>}
        {data.level === 'h3' && <h3 className="scroll-m-20 text-2xl font-semibold">{data.content}</h3>}
        {data.level === 'h4' && <h4 className="scroll-m-20 text-xl font-semibold">{data.content}</h4>}
        {data.level === 'h5' && <h5 className="scroll-m-20 text-lg font-semibold">{data.content}</h5>}
        {data.level === 'h6' && <h6 className="scroll-m-20 text-base font-semibold">{data.content}</h6>}
      </div>
    </div>
  );
};

export default HeadingBlock;
