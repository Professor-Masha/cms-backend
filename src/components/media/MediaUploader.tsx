
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Loader2 } from 'lucide-react';
import { Media } from '@/types/cms';

interface MediaUploaderProps {
  onMediaSelect: (media: Media) => void;
  mediaType?: 'image' | 'video' | 'audio' | 'all';
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onMediaSelect,
  mediaType = 'all'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = {
    image: 'image/*',
    video: 'video/*',
    audio: 'audio/*',
    all: 'image/*,video/*,audio/*'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file type if a specific type is requested
      if (mediaType !== 'all') {
        if (!selectedFile.type.startsWith(mediaType)) {
          toast({
            title: 'Invalid file type',
            description: `Please select a ${mediaType} file.`,
            variant: 'destructive',
          });
          return;
        }
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Get the authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to upload files.',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      const userId = session.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Add record to the media table
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          url: urlData.publicUrl,
          alt_text: altText || null,
          caption: caption || null,
          user_id: userId
        })
        .select()
        .single();

      if (mediaError) {
        throw mediaError;
      }

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been uploaded.`,
      });

      onMediaSelect(mediaData as Media);
      
      // Reset form
      setFile(null);
      setAltText('');
      setCaption('');
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-md p-6 text-center">
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
            {file.type.startsWith('image/') && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-md"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </div>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept={acceptedTypes[mediaType]}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select File
            </Button>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the content of the media"
            />
          </div>
          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption"
            />
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
