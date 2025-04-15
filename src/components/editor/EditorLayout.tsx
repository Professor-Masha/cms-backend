
import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import EditorToolbar from './EditorToolbar';
import EditorSidebar from './EditorSidebar';
import ArticleContent from './ArticleContent';
import { Article, Block, ArticleStatus, Category, Tag, BlockType } from '@/types/cms';
import { DropResult } from 'react-beautiful-dnd';

interface EditorLayoutProps {
  article: Article;
  blocks: Block[];
  categories: Category[];
  tags: Tag[];
  selectedCategories: string[];
  selectedTags: string[];
  onArticleChange: (key: string, value: any) => void;
  onStatusChange: (status: ArticleStatus) => void;
  onKeywordsChange: (keywords: string[]) => void;
  onAddBlock: (blockType: BlockType) => void;
  onUpdateBlock: (index: number, data: any) => void;
  onReorderBlocks: (result: DropResult) => void;
  onRemoveBlock: (index: number) => void;
  onCategoryToggle: (categoryId: string) => void;
  onTagToggle: (tagId: string) => void;
  onCreateCategory: (name: string) => void;
  onCreateTag: (name: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isSaving: boolean;
  onSave: (publish: boolean) => void;
  onCancel: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  article,
  blocks,
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onArticleChange,
  onStatusChange,
  onKeywordsChange,
  onAddBlock,
  onUpdateBlock,
  onReorderBlocks,
  onRemoveBlock,
  onCategoryToggle,
  onTagToggle,
  onCreateCategory,
  onCreateTag,
  searchTerm,
  onSearchChange,
  isSaving,
  onSave,
  onCancel,
  onUndo,
  onRedo,
  onPreview,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorToolbar 
        status={article.status}
        onStatusChange={onStatusChange}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={() => onSave(false)}
        onPublish={() => onSave(true)}
        onPreview={onPreview}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
      />
      
      <SidebarProvider>
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <Sidebar variant="sidebar" collapsible="icon">
              <SidebarContent>
                <EditorSidebar 
                  article={article}
                  onArticleChange={onArticleChange}
                  onStatusChange={onStatusChange}
                  onKeywordsChange={onKeywordsChange}
                  categories={categories}
                  tags={tags}
                  selectedCategories={selectedCategories}
                  selectedTags={selectedTags}
                  onCategoryToggle={onCategoryToggle}
                  onTagToggle={onTagToggle}
                  onCreateCategory={onCreateCategory}
                  onCreateTag={onCreateTag}
                  searchTerm={searchTerm}
                  onSearchChange={onSearchChange}
                  isSaving={isSaving}
                  onSave={onSave}
                  onCancel={onCancel}
                />
              </SidebarContent>
            </Sidebar>
            
            <SidebarInset className="px-4 py-6 overflow-auto">
              <ArticleContent
                blocks={blocks}
                onAddBlock={onAddBlock}
                onUpdateBlock={onUpdateBlock}
                onReorderBlocks={onReorderBlocks}
                onRemoveBlock={onRemoveBlock}
              />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default EditorLayout;
