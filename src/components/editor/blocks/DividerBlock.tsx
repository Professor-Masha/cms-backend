
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DividerBlockProps {
  data: {
    style?: 'solid' | 'dashed' | 'dotted';
    width?: 'full' | 'medium' | 'narrow';
    color?: 'default' | 'muted' | 'accent';
  };
  onChange: (data: any) => void;
}

const DividerBlock: React.FC<DividerBlockProps> = ({ data, onChange }) => {
  // Default values if not set
  const style = data.style || 'solid';
  const width = data.width || 'full';
  const color = data.color || 'default';
  
  // Calculate classes based on selected options
  const getLineClasses = () => {
    const classes = ['my-6'];
    
    // Border style
    if (style === 'dashed') classes.push('border-dashed');
    else if (style === 'dotted') classes.push('border-dotted');
    else classes.push('border-solid');
    
    // Width
    if (width === 'narrow') classes.push('w-1/4 mx-auto');
    else if (width === 'medium') classes.push('w-1/2 mx-auto');
    
    // Color
    if (color === 'muted') classes.push('border-muted');
    else if (color === 'accent') classes.push('border-primary');
    else classes.push('border-border');
    
    return classes.join(' ');
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Style</label>
          <Select 
            value={style} 
            onValueChange={(value) => onChange({ ...data, style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Width</label>
          <Select 
            value={width} 
            onValueChange={(value) => onChange({ ...data, width: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="narrow">Narrow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Color</label>
          <Select 
            value={color} 
            onValueChange={(value) => onChange({ ...data, color: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
              <SelectItem value="accent">Accent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        <hr className={getLineClasses()} />
      </div>
    </div>
  );
};

export default DividerBlock;
