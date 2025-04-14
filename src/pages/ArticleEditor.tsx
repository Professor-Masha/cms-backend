
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import BlockSelector from '@/components/editor/BlockSelector';
import BlockRenderer from '@/components/editor/BlockRenderer';
import TagsInput from '@/components/editor/TagsInput';
import MediaLibrary from '@/components/media/MediaLibrary';
import { BlockType, Article, Block, ArticleStatus, Category, Tag } from '@/types/cms';
import { Image, Search, Check, Trash } from 'lucide-react';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewArticle = id === 'new';
  
  const [article, setArticle] = useState<Article>({
    id: '',
    title: '',
    slug: '',
    description: '',
    status: 'draft',
    featured_image: null,
    author_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: null,
    keywords: []
  });
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNewArticle);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setArticle(prev => ({
        ...prev,
        author_id: session.user.id,
      }));
      
      fetchCategories();
      fetchTags();
      
      if (!isNewArticle) {
        fetchArticle(id!);
      }
    };
    
    checkAuth();
  }, [id, isNewArticle, navigate]);
  
  const fetchArticle = async (articleId: string) => {
    try {
      // Fetch article data
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (articleError) throw articleError;
      
      // Fetch blocks for this article
      const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('article_id', articleId)
        .order('order', { ascending: true });
      
      if (blocksError) throw blocksError;
      
      // Fetch categories for this article
      const { data: articleCategories, error: categoriesError } = await supabase
        .from('article_categories')
        .select('category_id')
        .eq('article_id', articleId);
      
      if (categoriesError) throw categoriesError;
      
      // Fetch tags for this article
      const { data: articleTags, error: tagsError } = await supabase
        .from('article_tags')
        .select('tag_id')
        .eq('article_id', articleId);
      
      if (tagsError) throw tagsError;
      
      setArticle(articleData as Article);
      setBlocks(blocksData as Block[] || []);
      setSelectedCategories(articleCategories.map(ac => ac.category_id));
      setSelectedTags(articleTags.map(at => at.tag_id));
    } catch (error: any) {
      toast({
        title: 'Error fetching article',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data as Category[]);
    } catch (error: any) {
      toast({
        title: 'Error fetching categories',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setTags(data as Tag[]);
    } catch (error: any) {
      toast({
        title: 'Error fetching tags',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setArticle(prev => ({
        ...prev,
        [name]: value,
        slug,
      }));
    } else {
      setArticle(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleStatusChange = (value: string) => {
    setArticle(prev => ({
      ...prev,
      status: value as ArticleStatus,
      published_at: value === 'published' ? new Date().toISOString() : prev.published_at,
    }));
  };
  
  const handleKeywordsChange = (keywords: string[]) => {
    setArticle(prev => ({
      ...prev,
      keywords
    }));
  };
  
  const addBlock = (blockType: BlockType) => {
    const newBlock: Block = {
      id: `temp-${Date.now()}`,
      article_id: article.id || 'temp',
      type: blockType,
      order: blocks.length,
      data: getDefaultDataForBlockType(blockType),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setBlocks(prev => [...prev, newBlock]);
  };
  
  const updateBlock = (index: number, data: any) => {
    setBlocks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], data, updated_at: new Date().toISOString() };
      return updated;
    });
  };
  
  const removeBlock = (index: number) => {
    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      
      // Update order of remaining blocks
      return updated.map((block, idx) => ({
        ...block,
        order: idx,
      }));
    });
  };
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    
    setBlocks(prev => {
      const updated = [...prev];
      const [movedBlock] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedBlock);
      
      // Update order of all blocks
      return updated.map((block, idx) => ({
        ...block,
        order: idx,
      }));
    });
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleCreateCategory = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, slug })
        .select()
        .single();
      
      if (error) throw error;
      
      setCategories(prev => [...prev, data as Category]);
      setSelectedCategories(prev => [...prev, data.id]);
      
      toast({
        title: 'Category created',
        description: `Category "${name}" has been created.`
      });
    } catch (error: any) {
      toast({
        title: 'Error creating category',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateTag = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('tags')
        .insert({ name, slug })
        .select()
        .single();
      
      if (error) throw error;
      
      setTags(prev => [...prev, data as Tag]);
      setSelectedTags(prev => [...prev, data.id]);
      
      toast({
        title: 'Tag created',
        description: `Tag "${name}" has been created.`
      });
    } catch (error: any) {
      toast({
        title: 'Error creating tag',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleFeaturedImageSelect = (media: any) => {
    setArticle(prev => ({
      ...prev,
      featured_image: media.url
    }));
    setMediaDialogOpen(false);
  };
  
  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    
    try {
      // Update status if publishing
      if (publish && article.status !== 'published') {
        setArticle(prev => ({
          ...prev,
          status: 'published' as ArticleStatus,
          published_at: new Date().toISOString(),
        }));
      }
      
      let articleId = article.id;
      
      // If new article, insert it first
      if (isNewArticle || !articleId) {
        const articleToInsert = {
          ...article,
          status: publish ? 'published' : article.status,
          published_at: publish ? new Date().toISOString() : article.published_at,
        };
        
        const { data: newArticle, error: articleError } = await supabase
          .from('articles')
          .insert([articleToInsert])
          .select()
          .single();
        
        if (articleError) throw articleError;
        
        if (newArticle) {
          articleId = newArticle.id;
          setArticle(newArticle as Article);
        } else {
          throw new Error('Failed to create article');
        }
      } else {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            ...article,
            updated_at: new Date().toISOString(),
          })
          .eq('id', articleId);
        
        if (updateError) throw updateError;
      }
      
      // Save blocks
      // First, remove any existing blocks if updating
      if (!isNewArticle) {
        await supabase
          .from('blocks')
          .delete()
          .eq('article_id', articleId);
      }
      
      // Then insert all current blocks
      if (blocks.length > 0) {
        const blocksToInsert = blocks.map((block, index) => ({
          article_id: articleId,
          order: index,
          type: block.type,
          data: block.data,
          created_at: block.created_at,
          updated_at: new Date().toISOString(),
        }));
        
        const { error: blocksError } = await supabase
          .from('blocks')
          .insert(blocksToInsert);
        
        if (blocksError) throw blocksError;
      }
      
      // Handle categories
      // First, remove existing categories for this article
      await supabase
        .from('article_categories')
        .delete()
        .eq('article_id', articleId);
      
      // Then insert selected categories
      if (selectedCategories.length > 0) {
        const categoriesToInsert = selectedCategories.map(categoryId => ({
          article_id: articleId,
          category_id: categoryId
        }));
        
        const { error: categoriesError } = await supabase
          .from('article_categories')
          .insert(categoriesToInsert);
        
        if (categoriesError) throw categoriesError;
      }
      
      // Handle tags
      // First, remove existing tags for this article
      await supabase
        .from('article_tags')
        .delete()
        .eq('article_id', articleId);
      
      // Then insert selected tags
      if (selectedTags.length > 0) {
        const tagsToInsert = selectedTags.map(tagId => ({
          article_id: articleId,
          tag_id: tagId
        }));
        
        const { error: tagsError } = await supabase
          .from('article_tags')
          .insert(tagsToInsert);
        
        if (tagsError) throw tagsError;
      }
      
      toast({
        title: isNewArticle ? 'Article created' : 'Article updated',
        description: publish 
          ? 'Your article has been published'
          : 'Your changes have been saved as a draft',
      });
      
      // Redirect to articles list or article view
      if (isNewArticle) {
        navigate(`/articles/${articleId}`);
      }
    } catch (error: any) {
      toast({
        title: 'Error saving article',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;
    
  const filteredTags = searchTerm
    ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : tags;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewArticle ? 'Create New Article' : 'Edit Article'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {article.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    placeholder="Article Title"
                    className="text-2xl font-bold"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    URL Slug
                  </label>
                  <Input
                    name="slug"
                    value={article.slug}
                    onChange={handleInputChange}
                    placeholder="article-url-slug"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description / Excerpt
                  </label>
                  <Textarea
                    name="description"
                    value={article.description || ''}
                    onChange={handleInputChange}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Keywords (for SEO)
                  </label>
                  <TagsInput
                    value={article.keywords || []}
                    onChange={handleKeywordsChange}
                    placeholder="Add keywords..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Press Enter or comma to add a keyword
                  </p>
                </div>
                
                <hr className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Content Blocks</h3>
                  
                  {blocks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-md">
                      <p className="text-muted-foreground mb-4">
                        Add your first content block
                      </p>
                      <BlockSelector onSelectBlock={addBlock} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {blocks.map((block, index) => (
                        <BlockRenderer
                          key={block.id}
                          block={block}
                          index={index}
                          onChange={(data) => updateBlock(index, data)}
                          onDelete={() => removeBlock(index)}
                          onMoveUp={() => moveBlock(index, index - 1)}
                          onMoveDown={() => moveBlock(index, index + 1)}
                          canMoveUp={index > 0}
                          canMoveDown={index < blocks.length - 1}
                        />
                      ))}
                      
                      <div className="text-center py-4">
                        <BlockSelector onSelectBlock={addBlock} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
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
                  <Select value={article.status} onValueChange={handleStatusChange}>
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
                      name="featured_image"
                      value={article.featured_image || ''}
                      onChange={(e) => setArticle(prev => ({
                        ...prev,
                        featured_image: e.target.value || null
                      }))}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim() && 
                          !categories.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
                        handleCreateCategory(searchTerm);
                        setSearchTerm('');
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
                        handleCreateCategory(searchTerm);
                        setSearchTerm('');
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
                        onClick={() => handleCategoryToggle(category.id)}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim() && 
                          !tags.some(t => t.name.toLowerCase() === searchTerm.toLowerCase())) {
                        handleCreateTag(searchTerm);
                        setSearchTerm('');
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
                        handleCreateTag(searchTerm);
                        setSearchTerm('');
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
                        onClick={() => handleTagToggle(tag.id)}
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
      </div>
    </div>
  );
};

const getDefaultDataForBlockType = (blockType: BlockType): any => {
  switch (blockType) {
    case 'text':
      return { content: 'Start writing here...' };
    case 'heading':
      return { content: 'Heading', level: 'h2' };
    case 'image':
      return { url: '', alt: '', caption: '' };
    case 'gallery':
      return { images: [], caption: '', columns: 3, gap: 'medium' };
    case 'list':
      return { items: ['Item 1'], style: 'unordered' };
    case 'quote':
      return { content: 'Quote text', attribution: '' };
    case 'video':
      return { url: '', caption: '' };
    case 'audio':
      return { url: '', title: '', artist: '', caption: '' };
    case 'code':
      return { content: '// Code here', language: 'javascript' };
    case 'divider':
      return { style: 'solid', width: 'full', color: 'default' };
    case 'button':
      return { text: 'Click Me', url: '#', style: 'primary' };
    default:
      return {};
  }
};

export default ArticleEditor;
