
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, MapPin, Search, RefreshCw } from 'lucide-react';

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
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const latitude = data.latitude || 40.7128;
  const longitude = data.longitude || -74.0060;
  const zoom = data.zoom || 13;
  const height = data.height || 400;
  const mapType = data.mapType || 'standard';
  
  const geocodeAddress = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Use Nominatim OpenStreetMap API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
      const results = await response.json();
      
      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        
        onChange({
          ...data,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          address: display_name
        });
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      alert('Error searching for address. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const getMapUrl = () => {
    const baseUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    return baseUrl;
  };
  
  // Generate a static map preview URL
  const getStaticMapUrl = () => {
    return `https://api.mapbox.com/styles/v1/mapbox/${getMapboxStyle()}/static/pin-l+ff0000(${longitude},${latitude})/${longitude},${latitude},${zoom},0/${Math.round(height * 1.5)}x${height}@2x?access_token=YOUR_MAPBOX_PUBLIC_TOKEN`;
  };
  
  const getMapboxStyle = () => {
    switch(mapType) {
      case 'satellite': return 'satellite-v9';
      case 'terrain': return 'outdoors-v12';
      default: return 'light-v11';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Map</Label>
      </div>
      
      <div className="relative">
        <Label htmlFor="map-search">Search Location</Label>
        <div className="flex space-x-2 mt-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="map-search"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search for an address"
              className="pl-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  geocodeAddress();
                }
              }}
            />
          </div>
          <Button 
            type="button" 
            onClick={geocodeAddress}
            disabled={isSearching}
            className="gap-1"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="map-latitude">Latitude</Label>
          <Input
            id="map-latitude"
            type="number"
            value={latitude}
            onChange={(e) => onChange({
              ...data,
              latitude: parseFloat(e.target.value) || 0
            })}
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
            onChange={(e) => onChange({
              ...data,
              longitude: parseFloat(e.target.value) || 0
            })}
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
            onValueChange={(value) => onChange({
              ...data,
              zoom: parseInt(value)
            })}
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
            onValueChange={(value) => onChange({
              ...data,
              mapType: value as 'standard' | 'satellite' | 'terrain'
            })}
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
            onChange={(e) => onChange({
              ...data,
              height: parseInt(e.target.value) || 400
            })}
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
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Map title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="map-description">Description (optional)</Label>
        <Textarea
          id="map-description"
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Description or instructions for this location"
          className="mt-1"
        />
      </div>
      
      <div className="mt-4 border rounded-md p-4">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        
        <div>
          {data.title && (
            <h3 className="text-lg font-medium mb-1">{data.title}</h3>
          )}
          
          {data.address && (
            <p className="text-sm text-muted-foreground mb-2">
              <MapPin className="inline-block h-3 w-3 mr-1" />
              {data.address}
            </p>
          )}
          
          <div className="rounded-md overflow-hidden border border-border" style={{ height: `${height}px` }}>
            <iframe 
              src={getMapUrl()}
              width="100%" 
              height={height}
              frameBorder="0" 
              scrolling="no"
              title={data.title || "Map"}
            ></iframe>
          </div>
          
          {data.description && (
            <p className="text-sm mt-2">{data.description}</p>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Note: To use Mapbox maps in a production environment, you'll need to add your Mapbox API key.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBlock;
