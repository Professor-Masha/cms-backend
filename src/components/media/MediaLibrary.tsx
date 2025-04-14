
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Media } from '@/types/cms';
import { Search, Image, Film, Music, Upload } from 'lucide-react';
import MediaUploader from './MediaUploader';

interface MediaLibraryProps {
  onSelect: (media: Media) => void;
  onClose: () => void;
  mediaType?: 'image' | 'video' | 'audio' | 'all';
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  onSelect, 
  onClose,
  mediaType = 'all'
}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, [mediaType]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by media type if specified
      if (mediaType === 'image') {
        query = query.like('file_type', 'image/%');
      } else if (mediaType === 'video') {
        query = query.like('file_type', 'video/%');
      } else if (mediaType === 'audio') {
        query = query.like('file_type', 'audio/%');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMedia(data as Media[]);
    } catch (error: any) {
      toast({
        title: 'Error fetching media',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      fetchMedia();
      return;
    }
    
    const filteredMedia = media.filter(item => 
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setMedia(filteredMedia);
  };

  const handleMediaSelect = (selectedMedia: Media) => {
    onSelect(selectedMedia);
  };

  const getMediaTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} />;
    if (fileType.startsWith('video/')) return <Film size={16} />;
    if (fileType.startsWith('audio/')) return <Music size={16} />;
    return null;
  };

  const renderMediaItem = (item: Media) => {
    return (
      <div 
        key={item.id}
        className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleMediaSelect(item)}
      >
        {item.file_type.startsWith('image/') ? (
          <div className="aspect-square bg-muted relative">
            <img 
              src={item.url} 
              alt={item.alt_text || item.file_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square bg-muted flex items-center justify-center">
            {getMediaTypeIcon(item.file_type)}
          </div>
        )}
        <div className="p-2">
          <div className="text-sm font-medium truncate">{item.file_name}</div>
          <div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="browse">Browse Media</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search size={16} />
            </Button>
          </form>
          
          {loading ? (
            <div className="h-60 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : media.length === 0 ? (
            <div className="h-60 flex items-center justify-center flex-col gap-2 text-muted-foreground">
              <Upload size={32} />
              <p>No media found. Upload some files first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
              {media.map(renderMediaItem)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <MediaUploader 
            onMediaSelect={(media) => {
              handleMediaSelect(media);
              fetchMedia();
            }}
            mediaType={mediaType}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MediaLibrary;
