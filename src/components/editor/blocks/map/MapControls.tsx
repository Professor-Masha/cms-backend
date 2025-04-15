
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MapControlsProps {
  latitude: number;
  longitude: number;
  zoom: number;
  height: number;
  mapType: 'standard' | 'satellite' | 'terrain';
  title: string;
  description: string;
  onLatitudeChange: (value: number) => void;
  onLongitudeChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onMapTypeChange: (value: 'standard' | 'satellite' | 'terrain') => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  latitude,
  longitude,
  zoom,
  height,
  mapType,
  title,
  description,
  onLatitudeChange,
  onLongitudeChange,
  onZoomChange,
  onHeightChange,
  onMapTypeChange,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="map-latitude">Latitude</Label>
          <Input
            id="map-latitude"
            type="number"
            value={latitude}
            onChange={(e) => onLatitudeChange(parseFloat(e.target.value) || 0)}
            step="0.0001"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="map-longitude">Longitude</Label>
          <Input
            id="map-longitude"
            type="number"
            value={longitude}
            onChange={(e) => onLongitudeChange(parseFloat(e.target.value) || 0)}
            step="0.0001"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="map-zoom">Zoom Level</Label>
          <Select 
            value={zoom.toString()} 
            onValueChange={(value) => onZoomChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Zoom" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(18)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1} {i < 6 ? '(Far)' : i > 14 ? '(Close)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="map-type">Map Type</Label>
          <Select 
            value={mapType} 
            onValueChange={(value) => onMapTypeChange(value as 'standard' | 'satellite' | 'terrain')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="map-height">Height (px)</Label>
          <Input
            id="map-height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value) || 400)}
            min={200}
            max={800}
            step={10}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="map-title">Title (optional)</Label>
        <Input
          id="map-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Map title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="map-description">Description (optional)</Label>
        <Textarea
          id="map-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description or instructions for this location"
          className="mt-1"
        />
      </div>
    </>
  );
};

export default MapControls;
