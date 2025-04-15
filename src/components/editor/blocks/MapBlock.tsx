
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Map } from 'lucide-react';
import MapSearch from './map/MapSearch';
import MapControls from './map/MapControls';
import MapPreview from './map/MapPreview';

interface MapBlockProps {
  data: {
    latitude: number;
    longitude: number;
    zoom: number;
    address?: string;
    title?: string;
    description?: string;
    height?: number;
    mapType?: 'standard' | 'satellite' | 'terrain';
  };
  onChange: (data: any) => void;
}

const MapBlock: React.FC<MapBlockProps> = ({ data, onChange }) => {
  const latitude = data.latitude || 40.7128;
  const longitude = data.longitude || -74.0060;
  const zoom = data.zoom || 13;
  const height = data.height || 400;
  const mapType = data.mapType || 'standard';
  
  const handleLocationFound = (lat: number, lon: number, address: string) => {
    onChange({
      ...data,
      latitude: lat,
      longitude: lon,
      address: address
    });
  };

  const updateValue = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Map</Label>
      </div>
      
      <MapSearch onLocationFound={handleLocationFound} />
      
      <MapControls
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        height={height}
        mapType={mapType}
        title={data.title || ''}
        description={data.description || ''}
        onLatitudeChange={(value) => updateValue('latitude', value)}
        onLongitudeChange={(value) => updateValue('longitude', value)}
        onZoomChange={(value) => updateValue('zoom', value)}
        onHeightChange={(value) => updateValue('height', value)}
        onMapTypeChange={(value) => updateValue('mapType', value)}
        onTitleChange={(value) => updateValue('title', value)}
        onDescriptionChange={(value) => updateValue('description', value)}
      />
      
      <MapPreview
        latitude={latitude}
        longitude={longitude}
        height={height}
        title={data.title}
        description={data.description}
        address={data.address}
      />
    </div>
  );
};

export default MapBlock;
