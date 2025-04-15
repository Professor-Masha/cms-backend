
interface HeroPreviewProps {
  backgroundUrl?: string;
  title: string;
  subtitle?: string;
  alignment: 'left' | 'center' | 'right';
  overlayOpacity: number;
  height: 'small' | 'medium' | 'large';
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle: 'primary' | 'secondary' | 'outline';
}

const HeroPreview: React.FC<HeroPreviewProps> = ({
  backgroundUrl,
  title,
  subtitle,
  alignment,
  overlayOpacity,
  height,
  buttonText,
  buttonUrl,
  buttonStyle
}) => {
  const getHeightClass = () => {
    switch (height) {
      case 'small': return 'h-64';
      case 'large': return 'h-screen';
      default: return 'h-96';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const getButtonClass = () => {
    switch (buttonStyle) {
      case 'secondary': return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      case 'outline': return 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground';
      default: return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  if (!backgroundUrl && !title) {
    return null;
  }

  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="text-sm text-muted-foreground p-2">Preview:</div>
      <div className={`relative ${getHeightClass()} overflow-hidden`}>
        {backgroundUrl && (
          <>
            <img 
              src={backgroundUrl} 
              alt="Hero Background" 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/1200x600?text=Image+Not+Found';
              }}
            />
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity || 0.3 }}
            ></div>
          </>
        )}
        <div className={`relative flex flex-col items-center justify-center h-full px-6 ${getAlignmentClass()}`}>
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-white/90 mb-6">
              {subtitle}
            </p>
          )}
          {buttonText && (
            <button className={`px-6 py-2 rounded-md ${getButtonClass()}`}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;
