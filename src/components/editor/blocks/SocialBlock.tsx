
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Github, 
  Dribbble, 
  Twitch, 
  Mail, 
  Globe, 
  Plus, 
  Trash2,
  Share
} from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

interface SocialBlockProps {
  data: {
    links: SocialLink[];
    layout?: 'row' | 'column' | 'grid';
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
    style?: 'filled' | 'outline' | 'simple';
    customColor?: string;
  };
  onChange: (data: any) => void;
}

const SocialBlock: React.FC<SocialBlockProps> = ({ data, onChange }) => {
  const links = data.links || [];
  const layout = data.layout || 'row';
  const size = data.size || 'medium';
  const style = data.style || 'filled';
  const showLabels = data.showLabels ?? true;
  
  const platformIcons: Record<string, JSX.Element> = {
    facebook: <Facebook />,
    twitter: <Twitter />,
    instagram: <Instagram />,
    linkedin: <Linkedin />,
    youtube: <Youtube />,
    github: <Github />,
    dribbble: <Dribbble />,
    twitch: <Twitch />,
    email: <Mail />,
    website: <Globe />,
    other: <Share />
  };
  
  const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'github', label: 'GitHub' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'email', label: 'Email' },
    { value: 'website', label: 'Website' },
    { value: 'other', label: 'Other' }
  ];

  const addLink = () => {
    const newLinks = [
      ...links,
      {
        id: `social-${Date.now()}`,
        platform: 'facebook',
        url: '',
        label: 'Facebook'
      }
    ];
    
    onChange({
      ...data,
      links: newLinks
    });
  };
  
  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links];
    
    if (field === 'platform') {
      // Auto update the label when platform changes
      const platform = platformOptions.find(p => p.value === value);
      newLinks[index] = {
        ...newLinks[index],
        [field]: value,
        label: platform?.label || ''
      };
    } else {
      newLinks[index] = {
        ...newLinks[index],
        [field]: value
      };
    }
    
    onChange({
      ...data,
      links: newLinks
    });
  };
  
  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    
    onChange({
      ...data,
      links: newLinks
    });
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };
  
  const getButtonSize = () => {
    switch (size) {
      case 'small': return 'h-8 w-8';
      case 'large': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };
  
  const getButtonStyle = (platform: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      facebook: { bg: 'bg-[#1877F2]', text: 'text-white', border: 'border-[#1877F2]' },
      twitter: { bg: 'bg-[#1DA1F2]', text: 'text-white', border: 'border-[#1DA1F2]' },
      instagram: { bg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]', text: 'text-white', border: 'border-[#E1306C]' },
      linkedin: { bg: 'bg-[#0077B5]', text: 'text-white', border: 'border-[#0077B5]' },
      youtube: { bg: 'bg-[#FF0000]', text: 'text-white', border: 'border-[#FF0000]' },
      github: { bg: 'bg-[#333333]', text: 'text-white', border: 'border-[#333333]' },
      dribbble: { bg: 'bg-[#EA4C89]', text: 'text-white', border: 'border-[#EA4C89]' },
      twitch: { bg: 'bg-[#6441A5]', text: 'text-white', border: 'border-[#6441A5]' },
      email: { bg: 'bg-[#D44638]', text: 'text-white', border: 'border-[#D44638]' },
      website: { bg: 'bg-[#4285F4]', text: 'text-white', border: 'border-[#4285F4]' },
      other: { bg: 'bg-[#718096]', text: 'text-white', border: 'border-[#718096]' }
    };
    
    // Use custom color if specified
    if (data.customColor) {
      return style === 'filled' 
        ? `bg-[${data.customColor}] text-white`
        : style === 'outline'
          ? `border border-[${data.customColor}] text-[${data.customColor}]`
          : `text-[${data.customColor}]`;
    }
    
    // Use platform-specific styling
    if (style === 'filled') {
      return `${colors[platform]?.bg || colors.other.bg} ${colors[platform]?.text || colors.other.text}`;
    } else if (style === 'outline') {
      return `border ${colors[platform]?.border || colors.other.border} text-foreground bg-transparent`;
    } else {
      // Simple style
      return 'text-foreground hover:text-primary';
    }
  };
  
  const getLayoutClass = () => {
    switch (layout) {
      case 'column': return 'flex flex-col gap-2';
      case 'grid': return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4';
      default: return 'flex flex-wrap gap-2';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Social Media Links</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addLink}
        >
          <Plus className="mr-1 h-3 w-3" /> Add Link
        </Button>
      </div>
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={link.id} className="flex gap-2 items-start p-3 rounded-md border">
            <Select 
              value={link.platform} 
              onValueChange={(value) => updateLink(index, 'platform', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4">
                        {platformIcons[option.value]}
                      </span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              placeholder={`Enter ${link.platform} URL`}
              className="flex-1"
            />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => removeLink(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">
              No social links added yet
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              className="mt-2"
            >
              <Plus className="mr-1 h-3 w-3" /> Add Link
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="social-layout">Layout</Label>
          <Select 
            id="social-layout"
            value={layout} 
            onValueChange={(value) => onChange({
              ...data,
              layout: value as 'row' | 'column' | 'grid'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Horizontal</SelectItem>
              <SelectItem value="column">Vertical</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="social-size">Icon Size</Label>
          <Select 
            id="social-size"
            value={size} 
            onValueChange={(value) => onChange({
              ...data,
              size: value as 'small' | 'medium' | 'large'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="social-style">Style</Label>
          <Select 
            id="social-style"
            value={style} 
            onValueChange={(value) => onChange({
              ...data,
              style: value as 'filled' | 'outline' | 'simple'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="show-labels" className="cursor-pointer select-none">
          Show labels
        </Label>
        <input
          id="show-labels"
          type="checkbox"
          checked={showLabels}
          onChange={(e) => onChange({
            ...data,
            showLabels: e.target.checked
          })}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>
      
      {links.length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <div className="text-sm text-muted-foreground mb-4">Preview:</div>
          
          <div className={getLayoutClass()}>
            {links.map((link) => (
              <div key={link.id} className="flex items-center">
                <button
                  type="button"
                  className={`flex items-center justify-center rounded-full ${getButtonStyle(link.platform)} ${getButtonSize()}`}
                >
                  <span className={getIconSize()}>
                    {platformIcons[link.platform] || platformIcons.other}
                  </span>
                </button>
                
                {showLabels && (
                  <span className="ml-2 text-sm font-medium">
                    {link.label || platformOptions.find(p => p.value === link.platform)?.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialBlock;
