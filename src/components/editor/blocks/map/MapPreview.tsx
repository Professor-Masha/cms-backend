
import { MapPin } from 'lucide-react';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  height: number;
  title?: string;
  description?: string;
  address?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  height,
  title,
  description,
  address
}) => {
  const getMapUrl = () => {
    const baseUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    return baseUrl;
  };
  
  return (
    <div className="mt-4 border rounded-md p-4">
      <div className="text-sm text-muted-foreground mb-2">Preview:</div>
      
      <div>
        {title && (
          <h3 className="text-lg font-medium mb-1">{title}</h3>
        )}
        
        {address && (
          <p className="text-sm text-muted-foreground mb-2">
            <MapPin className="inline-block h-3 w-3 mr-1" />
            {address}
          </p>
        )}
        
        <div className="rounded-md overflow-hidden border border-border" style={{ height: `${height}px` }}>
          <iframe 
            src={getMapUrl()}
            width="100%" 
            height={height}
            frameBorder="0" 
            scrolling="no"
            title={title || "Map"}
          ></iframe>
        </div>
        
        {description && (
          <p className="text-sm mt-2">{description}</p>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: To use Mapbox maps in a production environment, you'll need to add your Mapbox API key.</p>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
