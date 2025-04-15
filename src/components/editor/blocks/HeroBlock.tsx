
import { Media } from '@/types/cms';
import { Label } from '@/components/ui/label';
import HeroMediaSelector from './hero/HeroMediaSelector';
import HeroControls from './hero/HeroControls';
import HeroPreview from './hero/HeroPreview';

interface HeroBlockProps {
  data: {
    backgroundUrl: string;
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
    mediaId?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonStyle?: 'primary' | 'secondary' | 'outline';
    height?: 'small' | 'medium' | 'large';
  };
  onChange: (data: any) => void;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ data, onChange }) => {
  const handleMediaSelect = (media: Media) => {
    onChange({
      ...data,
      backgroundUrl: media.url,
      mediaId: media.id
    });
  };

  const handleValueChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Hero Banner</Label>
        <HeroMediaSelector
          backgroundUrl={data.backgroundUrl}
          onMediaSelect={handleMediaSelect}
        />
      </div>
      
      <HeroControls
        title={data.title || ''}
        subtitle={data.subtitle || ''}
        alignment={data.alignment || 'center'}
        overlayOpacity={data.overlayOpacity || 0.3}
        height={data.height || 'medium'}
        buttonText={data.buttonText || ''}
        buttonUrl={data.buttonUrl || ''}
        buttonStyle={data.buttonStyle || 'primary'}
        onValueChange={handleValueChange}
      />
      
      <HeroPreview
        backgroundUrl={data.backgroundUrl}
        title={data.title}
        subtitle={data.subtitle}
        alignment={data.alignment || 'center'}
        overlayOpacity={data.overlayOpacity || 0.3}
        height={data.height || 'medium'}
        buttonText={data.buttonText}
        buttonUrl={data.buttonUrl}
        buttonStyle={data.buttonStyle || 'primary'}
      />
    </div>
  );
};

export default HeroBlock;
