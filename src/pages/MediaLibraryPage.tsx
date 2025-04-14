
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Media } from '@/types/cms';
import MediaUploader from '@/components/media/MediaUploader';
import { Search, Trash2, Download, Edit, AudioLines, Video, Image, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MediaLibraryPage = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [updating, setUpdating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    alt_text: '',
    caption: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      fetchMedia();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by media type if specified
      if (activeTab === 'images') {
        query = query.like('file_type', 'image/%');
      } else if (activeTab === 'videos') {
        query = query.like('file_type', 'video/%');
      } else if (activeTab === 'audio') {
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery('');
    setTimeout(() => {
      fetchMedia();
    }, 0);
  };

  const handleMediaSelect = (item: Media) => {
    setSelectedMedia(item);
  };

  const openEditDialog = () => {
    if (!selectedMedia) return;
    
    setEditValues({
      alt_text: selectedMedia.alt_text || '',
      caption: selectedMedia.caption || ''
    });
    
    setEditDialogOpen(true);
  };

  const handleUpdateMedia = async () => {
    if (!selectedMedia) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('media')
        .update({
          alt_text: editValues.alt_text || null,
          caption: editValues.caption || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMedia.id);
      
      if (error) throw error;
      
      // Update local state
      setMedia(prev => prev.map(item => 
        item.id === selectedMedia.id 
          ? { 
              ...item, 
              alt_text: editValues.alt_text || null, 
              caption: editValues.caption || null,
              updated_at: new Date().toISOString()
            }
          : item
      ));
      
      setSelectedMedia(prev => 
        prev && {
          ...prev,
          alt_text: editValues.alt_text || null,
          caption: editValues.caption || null,
          updated_at: new Date().toISOString()
        }
      );
      
      toast({
        title: 'Media updated',
        description: 'The media information has been updated'
      });
      
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error updating media',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;
    
    if (!confirm('Are you sure you want to delete this media file? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([selectedMedia.url.split('/').slice(-2).join('/')]);
      
      if (storageError) {
        console.error('Storage error:', storageError);
        // Continue anyway as the file might have been deleted already
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', selectedMedia.id);
      
      if (dbError) throw dbError;
      
      // Update local state
      setMedia(prev => prev.filter(item => item.id !== selectedMedia.id));
      setSelectedMedia(null);
      
      toast({
        title: 'Media deleted',
        description: 'The media file has been deleted'
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting media',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (fileType.startsWith('audio/')) return <AudioLines className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <TabsContent value="all" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>All Media</CardTitle>
                  <CardDescription>View and manage all your media files</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="h-60 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                      <p>No media found. Upload some files first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {media.map(item => (
                        <div 
                          key={item.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${
                            selectedMedia?.id === item.id 
                              ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                              : 'hover:border-gray-400'
                          }`}
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
                              {getFileTypeIcon(item.file_type)}
                            </div>
                          )}
                          <div className="p-2">
                            <div className="text-sm font-medium truncate">{item.file_name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    {media.length} items
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="images" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>View and manage your image files</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="h-60 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                      <p>No images found. Upload some files first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {media.map(item => (
                        <div 
                          key={item.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${
                            selectedMedia?.id === item.id 
                              ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => handleMediaSelect(item)}
                        >
                          <div className="aspect-square bg-muted relative">
                            <img 
                              src={item.url} 
                              alt={item.alt_text || item.file_name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <div className="text-sm font-medium truncate">{item.file_name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="videos" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Videos</CardTitle>
                  <CardDescription>View and manage your video files</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="h-60 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                      <p>No videos found. Upload some files first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {media.map(item => (
                        <div 
                          key={item.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${
                            selectedMedia?.id === item.id 
                              ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => handleMediaSelect(item)}
                        >
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <Video className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div className="p-2">
                            <div className="text-sm font-medium truncate">{item.file_name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="audio" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Audio</CardTitle>
                  <CardDescription>View and manage your audio files</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="h-60 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                      <p>No audio files found. Upload some files first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {media.map(item => (
                        <div 
                          key={item.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${
                            selectedMedia?.id === item.id 
                              ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => handleMediaSelect(item)}
                        >
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <AudioLines className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div className="p-2">
                            <div className="text-sm font-medium truncate">{item.file_name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Media</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUploader 
                  onMediaSelect={(media) => {
                    setSelectedMedia(media);
                    fetchMedia();
                  }}
                  mediaType="all"
                />
              </CardContent>
            </Card>
            
            {selectedMedia && (
              <Card>
                <CardHeader>
                  <CardTitle>Media Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedMedia.file_type.startsWith('image/') && (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={selectedMedia.url} 
                        alt={selectedMedia.alt_text || selectedMedia.file_name}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {selectedMedia.file_type.startsWith('video/') && (
                    <div className="border rounded-md overflow-hidden">
                      <video 
                        src={selectedMedia.url} 
                        controls
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {selectedMedia.file_type.startsWith('audio/') && (
                    <div className="border rounded-md p-4">
                      <audio 
                        src={selectedMedia.url} 
                        controls
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium">File Name</h3>
                    <p className="text-sm">{selectedMedia.file_name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">File Type</h3>
                    <p className="text-sm">{selectedMedia.file_type}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">File Size</h3>
                    <p className="text-sm">{formatFileSize(selectedMedia.file_size)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">URL</h3>
                    <div className="flex gap-2 items-center">
                      <Input 
                        value={selectedMedia.url} 
                        readOnly 
                        className="text-sm"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMedia.url);
                          toast({
                            description: 'URL copied to clipboard',
                          });
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Alt Text</h3>
                    <p className="text-sm">{selectedMedia.alt_text || 'None'}</p>
                  </div>
                  
                  {selectedMedia.caption && (
                    <div>
                      <h3 className="font-medium">Caption</h3>
                      <p className="text-sm">{selectedMedia.caption}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium">Uploaded</h3>
                    <p className="text-sm">{new Date(selectedMedia.created_at).toLocaleString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={openEditDialog}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteMedia}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update the metadata for this media file
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="alt-text" className="text-sm font-medium">
                Alt Text
              </label>
              <Input
                id="alt-text"
                value={editValues.alt_text}
                onChange={(e) => setEditValues(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Describe the content of the media"
              />
              <p className="text-sm text-muted-foreground">
                Important for accessibility and SEO
              </p>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="caption" className="text-sm font-medium">
                Caption
              </label>
              <Input
                id="caption"
                value={editValues.caption}
                onChange={(e) => setEditValues(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Add a caption (optional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMedia} disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibraryPage;
