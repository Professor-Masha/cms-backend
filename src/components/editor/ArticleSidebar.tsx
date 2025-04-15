import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Check, Search, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TagsInput from '@/components/editor/TagsInput';
import MediaLibrary from '@/components/media/MediaLibrary';
import { ArticleStatus, Category, Tag } from '@/types/cms';

interface ArticleSidebarProps {
  article: {
    title: string;
    slug: string;
    description: string;
    status: ArticleStatus;
    featured_image: string | null;
    created_at: string;
    published_at: string | null;
    keywords?: string[]; // Make keywords optional
  };
  onArticleChange: (key: string, value: any) => void;
  onStatusChange: (status: ArticleStatus) => void;
  onKeywordsChange: (keywords: string[]) => void;
  categories: Category[];
  tags: Tag[];
  selectedCategories: string[];
  selectedTags: string[];
  onCategoryToggle: (categoryId: string) => void;
  onTagToggle: (tagId: string) => void;
  onCreateCategory: (name: string) => void;
  onCreateTag: (name: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isSaving: boolean;
  onSave: (publish: boolean) => void;
  onCancel: () => void;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  article,
  onArticleChange,
  onStatusChange,
  onKeywordsChange,
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategoryToggle,
  onTagToggle,
  onCreateCategory,
  onCreateTag,
  searchTerm,
  onSearchChange,
  isSaving,
  onSave,
  onCancel,
}) => {
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  
  const handleFeaturedImageSelect = (media: any) => {
    onArticleChange('featured_image', media.url);
    setMediaDialogOpen(false);
  };
  
  const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;
    
  const filteredTags = searchTerm
    ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : tags;
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => onSave(false)}
          disabled={isSaving}
        >
          Save Draft
        </Button>
        <Button 
          onClick={() => onSave(true)}
          disabled={isSaving}
        >
          {article.status === 'published' ? 'Update' : 'Publish'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Status
              </label>
              <Select value={article.status} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Featured Image
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={article.featured_image || ''}
                  onChange={(e) => onArticleChange('featured_image', e.target.value || null)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Image size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogTitle>Media Library</DialogTitle>
                    <MediaLibrary 
                      onSelect={handleFeaturedImageSelect} 
                      onClose={() => setMediaDialogOpen(false)}
                      mediaType="image"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {article.featured_image && (
                <div className="mt-2 border rounded-md overflow-hidden">
                  <img 
                    src={article.featured_image} 
                    alt="Featured" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Keywords (for SEO)
              </label>
              <TagsInput
                value={article.keywords || []} // Ensure default empty array if keywords is undefined
                onChange={onKeywordsChange}
                placeholder="Add keywords..."
              />
              <p className="text-sm text-muted-foreground mt-1">
                Press Enter or comma to add a keyword
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Created At
              </label>
              <Input
                value={new Date(article.created_at).toLocaleString()}
                readOnly
                disabled
              />
            </div>
            
            {article.published_at && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Published At
                </label>
                <Input
                  value={new Date(article.published_at).toLocaleString()}
                  readOnly
                  disabled
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories or create new..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim() && 
                      !categories.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
                    onCreateCategory(searchTerm);
                    onSearchChange('');
                  }
                }}
              />
              {searchTerm.trim() && 
               !categories.some(c => c.name.toLowerCase() === searchTerm.toLowerCase()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 text-xs"
                  onClick={() => {
                    onCreateCategory(searchTerm);
                    onSearchChange('');
                  }}
                >
                  + Create
                </Button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-1 border rounded-md p-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No categories found
                </div>
              ) : (
                filteredCategories.map(category => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer ${
                      selectedCategories.includes(category.id) 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => onCategoryToggle(category.id)}
                  >
                    <span>{category.name}</span>
                    {selectedCategories.includes(category.id) && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags or create new..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim() && 
                      !tags.some(t => t.name.toLowerCase() === searchTerm.toLowerCase())) {
                    onCreateTag(searchTerm);
                    onSearchChange('');
                  }
                }}
              />
              {searchTerm.trim() && 
               !tags.some(t => t.name.toLowerCase() === searchTerm.toLowerCase()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 text-xs"
                  onClick={() => {
                    onCreateTag(searchTerm);
                    onSearchChange('');
                  }}
                >
                  + Create
                </Button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-1 border rounded-md p-2">
              {filteredTags.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No tags found
                </div>
              ) : (
                filteredTags.map(tag => (
                  <div
                    key={tag.id}
                    className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer ${
                      selectedTags.includes(tag.id) 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => onTagToggle(tag.id)}
                  >
                    <span>{tag.name}</span>
                    {selectedTags.includes(tag.id) && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleSidebar;
