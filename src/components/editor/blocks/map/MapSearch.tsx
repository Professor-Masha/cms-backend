
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, MapPin, RefreshCw } from 'lucide-react';

interface MapSearchProps {
  onLocationFound: (lat: number, lon: number, address: string) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ onLocationFound }) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const geocodeAddress = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Use Nominatim OpenStreetMap API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
      const results = await response.json();
      
      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        onLocationFound(parseFloat(lat), parseFloat(lon), display_name);
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
  
  return (
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
  );
};

export default MapSearch;
