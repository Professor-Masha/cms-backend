
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { generatePreviewUrl } from '../services/previewService';
import { useToast } from '../hooks/useToast';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';

/**
 * Component for generating preview links for articles
 */
const PreviewLinkGenerator = ({ article }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = () => {
    if (!article || !article.id || !article.slug) {
      toast({
        title: 'Cannot generate preview link',
        description: 'Article ID or slug is missing',
        variant: 'destructive',
      });
      return;
    }

    const url = generatePreviewUrl(article);
    setPreviewUrl(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    
    toast({
      title: 'Link copied',
      description: 'Preview link copied to clipboard',
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleOpenPreview = () => {
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="space-y-3 mt-4">
      <Button onClick={handleGenerateLink} variant="secondary" size="sm">
        Generate Preview Link
      </Button>

      {previewUrl && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input value={previewUrl} readOnly className="text-xs" />
            <Button onClick={handleCopyLink} size="icon" variant="outline">
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
            <Button onClick={handleOpenPreview} size="icon">
              <ExternalLink size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link allows viewing the draft article before publishing.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewLinkGenerator;
