
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { 
  Check, 
  Search, 
  Image, 
  FileText, 
  Link, 
  Settings, 
  Hash, 
  Folder, 
  Tag
} from 'lucide-react';
import TagsInput from '@/components/editor/TagsInput';
import MediaLibrary from '@/components/media/MediaLibrary';
import { ArticleStatus, Category, Tag as TagType } from '@/types/cms';

interface EditorSidebarProps {
  article: {
    title: string;
    slug: string;
    description: string;
    status: ArticleStatus;
    featured_image: string | null;
    created_at: string;
    published_at: string | null;
    keywords?: string[];
  };
  onArticleChange: (key: string, value: any) => void;
  onStatusChange: (status: ArticleStatus) => void;
  onKeywordsChange: (keywords: string[]) => void;
  categories: Category[];
  tags: TagType[];
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

const EditorSidebar: React.FC<EditorSidebarProps> = ({
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
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onArticleChange('title', value);
    
    // Auto-generate slug from title
    if (!article.slug || article.slug === '') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      onArticleChange('slug', slug);
    }
  };
  
  const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;
    
  const filteredTags = searchTerm
    ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : tags;
  
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => onSave(false)}
          disabled={isSaving}
          size="sm"
        >
          Save Draft
        </Button>
        <Button 
          onClick={() => onSave(true)}
          disabled={isSaving}
          size="sm"
        >
          {article.status === 'published' ? 'Update' : 'Publish'}
        </Button>
      </div>
  
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <FileText size={16} />
          Title
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <Input
            value={article.title}
            onChange={handleTitleChange}
            placeholder="Article Title"
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Link size={16} />
          URL Slug
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <Input
            value={article.slug}
            onChange={(e) => onArticleChange('slug', e.target.value)}
            placeholder="article-url-slug"
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <FileText size={16} />
          Description
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <Textarea
            value={article.description || ''}
            onChange={(e) => onArticleChange('description', e.target.value)}
            placeholder="Brief description of the article"
            rows={3}
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Settings size={16} />
          Settings
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">
                Status
              </label>
              <Select value={article.status} onValueChange={(value) => onStatusChange(value as ArticleStatus)}>
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
              <label className="text-xs font-medium mb-1 block text-muted-foreground">
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
                <label className="text-xs font-medium mb-1 block text-muted-foreground">
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
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Image size={16} />
          Featured Image
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-2">
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
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={article.featured_image} 
                  alt="Featured" 
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Hash size={16} />
          Keywords
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <TagsInput
            value={article.keywords || []}
            onChange={onKeywordsChange}
            placeholder="Add keywords..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Press Enter or comma to add a keyword
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Folder size={16} />
          Categories
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-2">
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
            
            <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-2 text-muted-foreground text-xs">
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
                    <span className="text-sm">{category.name}</span>
                    {selectedCategories.includes(category.id) && (
                      <Check size={14} className="text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Tag size={16} />
          Tags
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-2">
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
            
            <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
              {filteredTags.length === 0 ? (
                <div className="text-center py-2 text-muted-foreground text-xs">
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
                    <span className="text-sm">{tag.name}</span>
                    {selectedTags.includes(tag.id) && (
                      <Check size={14} className="text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default EditorSidebar;
