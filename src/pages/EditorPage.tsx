
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ArticleContent from '@/components/editor/ArticleContent';
import ArticleSidebar from '@/components/editor/ArticleSidebar';
import { Article, Block, ArticleStatus, Category, Tag, BlockType } from '@/types/cms';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewArticle = !id || id === 'new';
  
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
      
      if (!isNewArticle && id) {
        fetchArticle(id);
      }
    };
    
    checkAuth();
  }, [id, isNewArticle, navigate]);
  
  const fetchArticle = async (articleId: string) => {
    try {
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (articleError) throw articleError;
      
      const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('article_id', articleId)
        .order('order', { ascending: true });
      
      if (blocksError) throw blocksError;
      
      const { data: articleCategories, error: categoriesError } = await supabase
        .from('article_categories')
        .select('category_id')
        .eq('article_id', articleId);
      
      if (categoriesError) throw categoriesError;
      
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
  
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setArticle(prev => ({
      ...prev,
      title: value,
      slug,
    }));
  };
  
  const handleSlugChange = (value: string) => {
    setArticle(prev => ({
      ...prev,
      slug: value,
    }));
  };
  
  const handleDescriptionChange = (value: string) => {
    setArticle(prev => ({
      ...prev,
      description: value,
    }));
  };
  
  const handleArticleChange = (key: string, value: any) => {
    setArticle(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleStatusChange = (value: ArticleStatus) => {
    setArticle(prev => ({
      ...prev,
      status: value,
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
    const getDefaultData = () => {
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
        case 'hero':
          return { 
            backgroundUrl: '', 
            title: 'Hero Title', 
            subtitle: 'Hero subtitle text goes here',
            alignment: 'center',
            height: 'medium',
            overlayOpacity: 0.3
          };
        case 'embed':
          return { 
            url: '', 
            type: 'custom', 
            width: 'full', 
            height: 400 
          };
        case 'social':
          return { 
            links: [], 
            layout: 'row',
            size: 'medium',
            showLabels: true,
            style: 'filled'
          };
        case 'map':
          return { 
            latitude: 40.7128, 
            longitude: -74.0060, 
            zoom: 13,
            height: 400,
            mapType: 'standard'
          };
        case 'accordion':
          return { 
            items: [
              { id: `accordion-${Date.now()}-1`, title: 'Accordion Item 1', content: 'Content for item 1' },
              { id: `accordion-${Date.now()}-2`, title: 'Accordion Item 2', content: 'Content for item 2' }
            ],
            collapsible: true,
            style: 'default',
            multiple: false
          };
        case 'html':
          return { 
            html: '<div>Add your custom HTML here</div>', 
            description: ''
          };
        case 'table':
          return { 
            headers: ['Header 1', 'Header 2', 'Header 3'],
            rows: [
              ['Cell 1', 'Cell 2', 'Cell 3'],
              ['Cell 4', 'Cell 5', 'Cell 6']
            ],
            style: 'default',
            headerStyle: 'default',
            width: 'full',
            alignment: 'left'
          };
        default:
          return {};
      }
    };
    
    const newBlock: Block = {
      id: `temp-${Date.now()}`,
      article_id: article.id || 'temp',
      type: blockType,
      order: blocks.length,
      data: getDefaultData(),
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
  
  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    
    try {
      let currentArticle = {
        ...article,
        status: publish ? 'published' as ArticleStatus : article.status,
        published_at: publish ? new Date().toISOString() : article.published_at,
        updated_at: new Date().toISOString(),
      };

      // For new articles, we need to create the article first
      if (isNewArticle) {
        // Remove the ID field for new articles to let Supabase generate it
        const { id: _, ...articleToInsert } = currentArticle;
        
        const { data: newArticle, error: articleError } = await supabase
          .from('articles')
          .insert([articleToInsert])
          .select()
          .single();
        
        if (articleError) throw articleError;
        
        if (newArticle) {
          currentArticle = newArticle as Article;
          setArticle(newArticle as Article);
          
          if (blocks.length > 0) {
            const blocksToInsert = blocks.map((block, index) => ({
              article_id: newArticle.id,
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
          
          if (selectedCategories.length > 0) {
            const categoriesToInsert = selectedCategories.map(categoryId => ({
              article_id: newArticle.id,
              category_id: categoryId
            }));
            
            const { error: categoriesError } = await supabase
              .from('article_categories')
              .insert(categoriesToInsert);
            
            if (categoriesError) throw categoriesError;
          }
          
          if (selectedTags.length > 0) {
            const tagsToInsert = selectedTags.map(tagId => ({
              article_id: newArticle.id,
              tag_id: tagId
            }));
            
            const { error: tagsError } = await supabase
              .from('article_tags')
              .insert(tagsToInsert);
            
            if (tagsError) throw tagsError;
          }
          
          toast({
            title: 'Article created',
            description: publish 
              ? 'Your article has been published'
              : 'Your article has been saved as a draft',
          });
          
          navigate(`/articles/${newArticle.id}`);
        }
      } else {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update(currentArticle)
          .eq('id', article.id);
        
        if (updateError) throw updateError;
        
        // Delete existing blocks and re-insert updated ones
        await supabase
          .from('blocks')
          .delete()
          .eq('article_id', article.id);
        
        if (blocks.length > 0) {
          const blocksToInsert = blocks.map((block, index) => ({
            article_id: article.id,
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
        
        // Update categories
        await supabase
          .from('article_categories')
          .delete()
          .eq('article_id', article.id);
        
        if (selectedCategories.length > 0) {
          const categoriesToInsert = selectedCategories.map(categoryId => ({
            article_id: article.id,
            category_id: categoryId
          }));
          
          const { error: categoriesError } = await supabase
            .from('article_categories')
            .insert(categoriesToInsert);
          
          if (categoriesError) throw categoriesError;
        }
        
        // Update tags
        await supabase
          .from('article_tags')
          .delete()
          .eq('article_id', article.id);
        
        if (selectedTags.length > 0) {
          const tagsToInsert = selectedTags.map(tagId => ({
            article_id: article.id,
            tag_id: tagId
          }));
          
          const { error: tagsError } = await supabase
            .from('article_tags')
            .insert(tagsToInsert);
          
          if (tagsError) throw tagsError;
        }
        
        toast({
          title: 'Article updated',
          description: publish 
            ? 'Your article has been published'
            : 'Your changes have been saved',
        });
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ArticleContent
            title={article.title}
            slug={article.slug}
            description={article.description || ''}
            blocks={blocks}
            onTitleChange={handleTitleChange}
            onSlugChange={handleSlugChange}
            onDescriptionChange={handleDescriptionChange}
            onAddBlock={addBlock}
            onUpdateBlock={updateBlock}
            onMoveBlock={moveBlock}
            onRemoveBlock={removeBlock}
          />
        </div>
        
        <div>
          <ArticleSidebar
            article={article}
            onArticleChange={handleArticleChange}
            onStatusChange={handleStatusChange}
            onKeywordsChange={handleKeywordsChange}
            categories={categories}
            tags={tags}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onCategoryToggle={handleCategoryToggle}
            onTagToggle={handleTagToggle}
            onCreateCategory={handleCreateCategory}
            onCreateTag={handleCreateTag}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isSaving={saving}
            onSave={handleSave}
            onCancel={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
