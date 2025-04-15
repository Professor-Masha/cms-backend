
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BlockMenu from './BlockMenu';
import BlockRenderer from '@/components/editor/BlockRenderer';
import { Block, BlockType } from '@/types/cms';

interface ArticleContentProps {
  title: string;
  slug: string;
  description: string;
  blocks: Block[];
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddBlock: (blockType: BlockType) => void;
  onUpdateBlock: (index: number, data: any) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
  onRemoveBlock: (index: number) => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  slug,
  description,
  blocks,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
  onAddBlock,
  onUpdateBlock,
  onMoveBlock,
  onRemoveBlock,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Article Title"
              className="text-2xl font-bold"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              URL Slug
            </label>
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="article-url-slug"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description / Excerpt
            </label>
            <Textarea
              value={description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
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
                <BlockMenu onAddBlock={onAddBlock} />
              </div>
            ) : (
              <div className="space-y-6">
                {blocks.map((block, index) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    index={index}
                    onChange={(data) => onUpdateBlock(index, data)}
                    onDelete={() => onRemoveBlock(index)}
                    onMoveUp={() => onMoveBlock(index, index - 1)}
                    onMoveDown={() => onMoveBlock(index, index + 1)}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                  />
                ))}
                
                <BlockMenu onAddBlock={onAddBlock} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
