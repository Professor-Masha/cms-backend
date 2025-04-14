
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
  Globe,
  Plus,
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react';

interface SocialBlockProps {
  data: {
    links: Array<{
      id: string;
      platform: string;
      url: string;
      label: string;
    }>;
    layout: 'row' | 'column' | 'grid';
    size: 'small' | 'medium' | 'large';
    showLabels: boolean;
    style: 'outline' | 'filled' | 'simple';
  };
  onChange: (data: any) => void;
}

const SocialBlock: React.FC<SocialBlockProps> = ({ data, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlatform, setEditPlatform] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: <Facebook /> },
    { value: 'twitter', label: 'Twitter', icon: <Twitter /> },
    { value: 'instagram', label: 'Instagram', icon: <Instagram /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube /> },
    { value: 'github', label: 'GitHub', icon: <Github /> },
    { value: 'website', label: 'Website', icon: <Globe /> },
  ];

  const addLink = () => {
    const newLink = {
      id: `social-${Date.now()}`,
      platform: 'facebook',
      url: '',
      label: 'Facebook'
    };
    
    onChange({
      ...data,
      links: [...data.links, newLink]
    });
  };

  const removeLink = (id: string) => {
    onChange({
      ...data,
      links: data.links.filter(link => link.id !== id)
    });
  };

  const startEditing = (id: string, platform: string, url: string, label: string) => {
    setEditingId(id);
    setEditPlatform(platform);
    setEditUrl(url);
    setEditLabel(label);
  };

  const saveEditing = () => {
    if (!editingId) return;
    
    onChange({
      ...data,
      links: data.links.map(link => 
        link.id === editingId 
          ? { 
              ...link, 
              platform: editPlatform, 
              url: editUrl, 
              label: editLabel 
            } 
          : link
      )
    });
    
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleOptionChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  const getSocialIcon = (platform: string) => {
    const found = platforms.find(p => p.value === platform);
    return found ? found.icon : <Globe />;
  };

  const renderSocialLinks = () => {
    const sizeClasses = {
      small: 'h-8 w-8',
      medium: 'h-10 w-10',
      large: 'h-12 w-12'
    };
    
    const styleClasses = {
      outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      filled: 'bg-primary text-primary-foreground hover:bg-primary/90',
      simple: 'text-foreground hover:text-primary'
    };
    
    const containerClasses = {
      row: 'flex flex-row flex-wrap gap-2',
      column: 'flex flex-col gap-2',
      grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'
    };
    
    return (
      <div className={containerClasses[data.layout]}>
        {data.links.map(link => (
          <a 
            key={link.id}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center
              rounded-md transition-colors
              ${data.showLabels ? 'gap-2 px-4 py-2' : ''}
              ${styleClasses[data.style]}
              ${!data.showLabels ? sizeClasses[data.size] : ''}
            `}
          >
            <span className={data.showLabels ? 'text-lg' : sizeClasses[data.size]}>
              {getSocialIcon(link.platform)}
            </span>
            {data.showLabels && <span>{link.label}</span>}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="social-layout">Layout</Label>
          <Select 
            value={data.layout} 
            onValueChange={(value: 'row' | 'column' | 'grid') => handleOptionChange('layout', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Row</SelectItem>
              <SelectItem value="column">Column</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="social-size">Icon Size</Label>
          <Select 
            value={data.size} 
            onValueChange={(value: 'small' | 'medium' | 'large') => handleOptionChange('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
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
            value={data.style} 
            onValueChange={(value: 'outline' | 'filled' | 'simple') => handleOptionChange('style', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="social-showLabels">Show Labels</Label>
          <Switch 
            id="social-showLabels"
            checked={data.showLabels}
            onCheckedChange={(checked) => handleOptionChange('showLabels', checked)}
          />
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Social Links</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={addLink}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Link
          </Button>
        </div>

        <div className="space-y-2">
          {data.links.map((link) => (
            <div key={link.id} className="border rounded-md">
              {editingId === link.id ? (
                <div className="p-3 space-y-2">
                  <div>
                    <Label htmlFor={`edit-platform-${link.id}`} className="text-xs">
                      Platform
                    </Label>
                    <Select
                      value={editPlatform}
                      onValueChange={setEditPlatform}
                    >
                      <SelectTrigger id={`edit-platform-${link.id}`}>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center gap-2">
                              {platform.icon}
                              <span>{platform.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`edit-url-${link.id}`} className="text-xs">
                      URL
                    </Label>
                    <Input
                      id={`edit-url-${link.id}`}
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-label-${link.id}`} className="text-xs">
                      Label
                    </Label>
                    <Input
                      id={`edit-label-${link.id}`}
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={saveEditing}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    {getSocialIcon(link.platform)}
                    <span>{link.label}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(link.id, link.platform, link.url, link.label)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeLink(link.id)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        {renderSocialLinks()}
      </div>
    </div>
  );
};

export default SocialBlock;
