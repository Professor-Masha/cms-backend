
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface AccordionControlsProps {
  style: 'default' | 'bordered' | 'simple';
  collapsible: boolean;
  multiple: boolean;
  onStyleChange: (value: 'default' | 'bordered' | 'simple') => void;
  onCollapsibleChange: (checked: boolean) => void;
  onMultipleChange: (checked: boolean) => void;
}

const AccordionControls: React.FC<AccordionControlsProps> = ({
  style,
  collapsible,
  multiple,
  onStyleChange,
  onCollapsibleChange,
  onMultipleChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="accordion-style">Style</Label>
        <Select 
          value={style} 
          onValueChange={(value) => onStyleChange(value as 'default' | 'bordered' | 'simple')}
        >
          <SelectTrigger id="accordion-style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="bordered">Bordered</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="accordion-collapsible">Allow All Closed</Label>
          <Switch 
            id="accordion-collapsible"
            checked={collapsible}
            onCheckedChange={onCollapsibleChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="accordion-multiple">Allow Multiple Open</Label>
          <Switch 
            id="accordion-multiple"
            checked={multiple}
            onCheckedChange={onMultipleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AccordionControls;
