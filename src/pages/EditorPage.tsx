import React, { useReducer, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import EditorLayout from '@/components/editor/EditorLayout';
import { Article, Block, ArticleStatus, Category, Tag, BlockType } from '@/types/cms';
import { DropResult } from 'react-beautiful-dnd';

type HistoryState = {
  past: { article: Article; blocks: Block[] }[];
  present: { article: Article; blocks: Block[] };
  future: { article: Article; blocks: Block[] }[];
};

type HistoryAction =
  | { type: 'SAVE_STATE'; payload: { article: Article; blocks: Block[] } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY'; payload: { article: Article; blocks: Block[] } };

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'SAVE_STATE':
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, state.past.length - 1),
        present: previous,
        future: [state.present, ...state.future],
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    case 'CLEAR_HISTORY':
      return {
        past: [],
        present: action.payload,
        future: [],
      };
    default:
      return state;
  }
};

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewArticle = !id || id === 'new';
  
  const initialArticle: Article = {
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
  };

  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: { article: initialArticle, blocks: [] },
    future: [],
  });

  const { article, blocks } = history.present;
  
  const setArticle = (updateFn: (prevArticle: Article) => Article) => {
    dispatch({
      type: 'SAVE_STATE',
      payload: { 
        article: updateFn(article), 
        blocks 
      }
    });
  };
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNewArticle);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const saveToHistory = () => {
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks },
    });
  };

  const updateState = (newArticle: Article, newBlocks: Block[]) => {
    dispatch({
      type: 'CLEAR_HISTORY',
      payload: { article: newArticle, blocks: newBlocks },
    });
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      updateState(
        { ...article, author_id: session.user.id },
        blocks
      );
      
      fetchCategories();
      fetchTags();
      
      if (!isNewArticle && id) {
        fetchArticle(id);
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNewArticle, navigate]);
  
  const fetchArticle = async (articleId: string) => {
    try {
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (articleError) throw articleError;
      
      const articleWithKeywords = {
        ...articleData,
        keywords: articleData.keywords || []
      };
      
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
      
      updateState(
        articleWithKeywords as Article,
        blocksData as Block[] || []
      );
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
  
  const addBlock = (blockType: BlockType, afterIndex: number = -1) => {
    saveToHistory();
    
    const getDefaultData = () => {
      switch (blockType) {
        case 'paragraph':
          return { 
            content: '', 
            alignment: 'left',
            format: {
              bold: false,
              italic: false,
              strikethrough: false,
              highlight: false,
              code: false,
              superscript: false,
              subscript: false
            },
            fontSize: 'normal',
            textColor: '',
            backgroundColor: ''
          };
        case 'text':
          return { content: '', alignment: 'left' };
        case 'heading':
          return { content: 'Heading', level: 'h2', alignment: 'left' };
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
        case 'columns':
          return {
            columns: [
              { id: `col-${Date.now()}-1`, width: 50, blocks: [] },
              { id: `col-${Date.now()}-2`, width: 50, blocks: [] }
            ],
            gapSize: 'medium'
          };
        
        case 'group':
          return {
            blocks: [],
            label: 'Group',
            style: 'default'
          };
          
        case 'row':
          return {
            blocks: [],
            alignment: 'center',
            spacing: 'medium',
            wrap: true
          };
          
        case 'stack':
          return {
            blocks: [],
            spacing: 'medium',
            alignment: 'start'
          };
          
        default:
          return {};
      }
    };
    
    const newBlock: Block = {
      id: `temp-${Date.now()}`,
      article_id: article.id || 'temp',
      type: blockType,
      order: afterIndex >= 0 ? afterIndex + 1 : blocks.length,
      data: getDefaultData(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    if (afterIndex >= 0) {
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(afterIndex + 1, 0, newBlock);
      
      const reindexedBlocks = updatedBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));
      
      dispatch({
        type: 'SAVE_STATE',
        payload: { 
          article, 
          blocks: reindexedBlocks
        }
      });
    } else {
      dispatch({
        type: 'SAVE_STATE',
        payload: { 
          article, 
          blocks: [...blocks, newBlock]
        }
      });
    }
  };
  
  const updateBlock = (index: number, data: any) => {
    saveToHistory();
    
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { 
      ...updatedBlocks[index], 
      data, 
      updated_at: new Date().toISOString() 
    };
    
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks: updatedBlocks }
    });
  };
  
  const removeBlock = (index: number) => {
    saveToHistory();
    
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    
    const reindexedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));
    
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks: reindexedBlocks }
    });
  };
  
  const duplicateBlock = (index: number) => {
    saveToHistory();
    
    const blockToDuplicate = blocks[index];
    const duplicatedData = JSON.parse(JSON.stringify(blockToDuplicate.data));
    
    const newBlock: Block = {
      id: `temp-${Date.now()}`,
      article_id: article.id || 'temp',
      type: blockToDuplicate.type,
      order: index + 1,
      data: duplicatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    
    const reindexedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));
    
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks: reindexedBlocks }
    });
  };
  
  const groupBlocks = (indices: number[]) => {
    saveToHistory();
    
    if (indices.length < 2) return;
    
    indices.sort((a, b) => a - b);
    
    const blocksToGroup = indices.map(index => blocks[index]);
    
    const groupBlock: Block = {
      id: `temp-${Date.now()}`,
      article_id: article.id || 'temp',
      type: 'group',
      order: indices[0],
      data: {
        blocks: blocksToGroup,
        label: 'Block Group',
        style: 'default'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedBlocks = blocks.filter((_, index) => !indices.includes(index));
    
    updatedBlocks.splice(indices[0], 0, groupBlock);
    
    const reindexedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));
    
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks: reindexedBlocks }
    });
  };
  
  const handleReorderBlocks = (result: DropResult) => {
    if (!result.destination) return;
    
    saveToHistory();
    
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    
    if ('duplicatedBlock' in result) {
      const customResult = result as unknown as { duplicatedBlock: Block };
      const newBlocks = [...blocks];
      newBlocks.splice(toIndex, 0, customResult.duplicatedBlock);
      
      const reindexedBlocks = newBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));
      
      dispatch({
        type: 'SAVE_STATE',
        payload: { article, blocks: reindexedBlocks }
      });
      return;
    }
    
    if (fromIndex === toIndex) return;
    
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    
    const reindexedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));
    
    dispatch({
      type: 'SAVE_STATE',
      payload: { article, blocks: reindexedBlocks }
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
  
  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };
  
  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };
  
  const handlePreview = () => {
    toast({
      title: 'Preview',
      description: 'Preview functionality not implemented yet.',
    });
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

      if (isNewArticle) {
        const { id: _, ...articleToInsert } = currentArticle;
        
        const { data: newArticle, error: articleError } = await supabase
          .from('articles')
          .insert([articleToInsert])
          .select()
          .single();
        
        if (articleError) throw articleError;
        
        if (newArticle) {
          currentArticle = newArticle as Article;
          
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
          
          updateState(
            newArticle as Article,
            blocks.map(block => ({
              ...block,
              article_id: newArticle.id
            }))
          );
          
          navigate(`/articles/${newArticle.id}`);
        }
      } else {
        const { error: updateError } = await supabase
          .from('articles')
          .update(currentArticle)
          .eq('id', article.id);
        
        if (updateError) throw updateError;
        
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
        
        updateState(currentArticle, blocks);
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
    <EditorLayout
      article={article}
      blocks={blocks}
      categories={categories}
      tags={tags}
      selectedCategories={selectedCategories}
      selectedTags={selectedTags}
      onArticleChange={handleArticleChange}
      onStatusChange={handleStatusChange}
      onKeywordsChange={handleKeywordsChange}
      onAddBlock={addBlock}
      onUpdateBlock={updateBlock}
      onReorderBlocks={handleReorderBlocks}
      onRemoveBlock={removeBlock}
      onCategoryToggle={handleCategoryToggle}
      onTagToggle={handleTagToggle}
      onCreateCategory={handleCreateCategory}
      onCreateTag={handleCreateTag}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isSaving={saving}
      onSave={handleSave}
      onCancel={() => navigate('/')}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onPreview={handlePreview}
      canUndo={history.past.length > 0}
      canRedo={history.future.length > 0}
    />
  );
};

export default EditorPage;
