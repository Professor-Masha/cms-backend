
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BlockSelector from '@/components/editor/BlockSelector';
import BlockRenderer from '@/components/editor/BlockRenderer';
import { BlockType, Article, Block } from '@/types/cms';

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
  });
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(!isNewArticle);
  const [saving, setSaving] = useState(false);
  
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
      
      setArticle(articleData);
      setBlocks(blocksData || []);
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
      status: value,
      published_at: value === 'published' ? new Date().toISOString() : prev.published_at,
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
  
  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    
    try {
      // Update status if publishing
      if (publish && article.status !== 'published') {
        setArticle(prev => ({
          ...prev,
          status: 'published',
          published_at: new Date().toISOString(),
        }));
      }
      
      let articleId = article.id;
      
      // If new article, insert it first
      if (isNewArticle || !articleId) {
        const { data: newArticle, error: articleError } = await supabase
          .from('articles')
          .insert([{
            ...article,
            status: publish ? 'published' : article.status,
            published_at: publish ? new Date().toISOString() : article.published_at,
          }])
          .select()
          .single();
        
        if (articleError) throw articleError;
        
        articleId = newArticle.id;
        setArticle(newArticle);
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
        const { error: blocksError } = await supabase
          .from('blocks')
          .insert(
            blocks.map((block, index) => ({
              ...block,
              id: undefined, // Let Supabase generate IDs
              article_id: articleId,
              order: index,
            }))
          );
        
        if (blocksError) throw blocksError;
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
                    value={article.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
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
        
        <div>
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
                    Featured Image URL
                  </label>
                  <Input
                    name="featured_image"
                    value={article.featured_image || ''}
                    onChange={(e) => setArticle(prev => ({
                      ...prev,
                      featured_image: e.target.value || null
                    }))}
                    placeholder="https://example.com/image.jpg"
                  />
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
        </div>
      </div>
    </div>
  );
};

// Helper function to get default data for each block type
const getDefaultDataForBlockType = (blockType: BlockType): any => {
  switch (blockType) {
    case 'text':
      return { content: 'Start writing here...' };
    case 'heading':
      return { content: 'Heading', level: 'h2' };
    case 'image':
      return { url: '', alt: '', caption: '' };
    case 'list':
      return { items: ['Item 1'], style: 'unordered' };
    case 'quote':
      return { content: 'Quote text', attribution: '' };
    case 'video':
      return { url: '', caption: '' };
    case 'code':
      return { content: '// Code here', language: 'javascript' };
    case 'divider':
      return {};
    case 'button':
      return { text: 'Click Me', url: '#', style: 'primary' };
    default:
      return {};
  }
};

export default ArticleEditor;
