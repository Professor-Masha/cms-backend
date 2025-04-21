
import React from 'react';
import { Card } from '@/components/ui/card';
import { Block } from '@/types/cms';
import BlockRenderer from '../BlockRenderer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColumnsBlockProps {
  data: {
    columns: Array<{
      id: string;
      width: number;
      widthUnit?: string;
      blocks: Block[];
    }>;
    gapSize: 'small' | 'medium' | 'large';
    stackOnMobile: boolean;
  };
  onChange: (data: any) => void;
}

const gapMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'gap-3',
  medium: 'gap-5',
  large: 'gap-8',
};

// Helper: get Tailwind grid style for columns
const getColumnStyle = (width: number, unit: string = '%') => {
  if (unit === '%') return { width: `${width}%` };
  return { flex: `0 0 auto`, width: `${width}${unit}` };
};

const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ data, onChange }) => {
  // Handlers for adding/removing blocks inside a column
  const handleAddBlock = (colIdx: number) => {
    const columns = data.columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      return {
        ...col,
        blocks: [
          ...col.blocks,
          {
            id: `temp-${Date.now()}`,
            article_id: '', // not required for this editor structure
            type: 'paragraph',
            order: col.blocks.length,
            data: {
              content: '',
              alignment: 'left',
              format: {
                bold: false,
                italic: false,
                strikethrough: false,
                highlight: false,
                code: false,
                superscript: false,
                subscript: false,
              },
              fontSize: 'normal',
              textColor: '',
              backgroundColor: ''
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ],
      };
    });
    onChange({ ...data, columns });
  };

  const handleUpdateBlock = (colIdx: number, blockIdx: number, blockData: any) => {
    const columns = data.columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      const newBlocks = [...col.blocks];
      newBlocks[blockIdx] = {
        ...newBlocks[blockIdx],
        data: blockData,
        updated_at: new Date().toISOString()
      };
      return { ...col, blocks: newBlocks };
    });
    onChange({ ...data, columns });
  };

  const handleDeleteBlock = (colIdx: number, blockIdx: number) => {
    const columns = data.columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      const newBlocks = [...col.blocks];
      newBlocks.splice(blockIdx, 1);
      return { ...col, blocks: newBlocks };
    });
    onChange({ ...data, columns });
  };

  // Get spacing between columns
  const gapClass = gapMap[data.gapSize] || gapMap.medium;

  return (
    <div className={`flex ${gapClass} w-full`} style={{ minHeight: 120 }}>
      {data.columns.map((column, colIdx) => (
        <div
          key={column.id}
          style={getColumnStyle(column.width, column.widthUnit || '%')}
          className="bg-[#f6f6f7] rounded-md p-4 flex flex-col gap-4 border border-gray-200 min-h-[100px] transition-shadow relative group"
        >
          {column.blocks && column.blocks.length > 0 ? (
            column.blocks.map((block, blockIdx) => (
              <div key={block.id} className="mb-2">
                <BlockRenderer
                  block={block}
                  index={blockIdx}
                  onChange={(blockData: any) => handleUpdateBlock(colIdx, blockIdx, blockData)}
                  onDelete={() => handleDeleteBlock(colIdx, blockIdx)}
                  onMoveUp={() => {}} // Not implemented in columns for simplicity
                  onMoveDown={() => {}}
                  canMoveUp={blockIdx > 0}
                  canMoveDown={blockIdx < column.blocks.length - 1}
                  isSelected={false}
                  isMultiSelected={false}
                  onSelect={() => {}}
                />
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground italic text-xs opacity-85">
              No blocks. Click + to add.
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white shadow group-hover:shadow-md border-gray-300 z-10"
            onClick={() => handleAddBlock(colIdx)}
            aria-label="Add block to column"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ColumnsBlock;

