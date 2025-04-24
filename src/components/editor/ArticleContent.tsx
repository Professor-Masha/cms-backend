
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import BlockMenu from "./BlockMenu";
import BlockSelector from "./BlockSelector";
import DraggableBlockList from "./DraggableBlockList";
import { Block, BlockType } from "@/types/cms";
import { DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ArticleContentProps {
  blocks: Block[];
  onAddBlock: (blockType: BlockType | any) => void;
  onUpdateBlock: (index: number, data: any) => void;
  onReorderBlocks: (result: DropResult) => void;
  onRemoveBlock: (index: number) => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  blocks,
  onAddBlock,
  onUpdateBlock,
  onReorderBlocks,
  onRemoveBlock,
}) => {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockSearchTerm, setBlockSearchTerm] = useState('');
  const { toast } = useToast();

  // Add debugging to track when blocks are created/rendered
  useEffect(() => {
    console.log('Current blocks:', blocks);
  }, [blocks]);

  // Enhanced handler for drag end event with support for custom operations
  const handleDragEnd = (result: any) => {
    // Handle case when we have customBlocks (direct manipulation)
    if ('customBlocks' in result) {
      // The parent component will handle the full block replacement
      onReorderBlocks({
        ...result,
        customBlocks: result.customBlocks,
      });
      return;
    }

    // No destination (dropped outside droppable area)
    if (!result.destination) return;

    // Handle block duplication
    if (result.source.index === -1 && 'duplicatedBlock' in result) {
      const customResult = result as unknown as { duplicatedBlock: Block };
      const newBlocks = [...blocks]
      newBlocks.splice(result.destination.index, 0, customResult.duplicatedBlock);
      
      // Reindex blocks
      const reindexedBlocks = newBlocks.map((block, idx) => ({
        ...block,
        order: idx,
      }));

      // Create a standard DropResult for the parent component
      const standardResult: DropResult = {
        draggableId: customResult.duplicatedBlock.id,
        type: 'DEFAULT',
        source: {
          index: blocks.length, // Coming from the end
          droppableId: 'blocks'
        },
        destination: {
          index: result.destination.index,
          droppableId: 'blocks'
        },
        reason: 'DROP',
        mode: 'FLUID',
        combine: null
      }

      // Pass both the blocks and the result to the parent
      onReorderBlocks(standardResult);
      return;
    }

    onReorderBlocks(result);
  };

  // Function to handle block type creation
  const handleAddBlock = (blockTypeData: BlockType | any, afterIndex = -1) => {
    if (
      typeof blockTypeData === "object" &&
      blockTypeData.type === "columns"
    ) {
      const { type, variant, layout } = blockTypeData;

      // Handle skip or non-skip cases
      if (variant === "skip") {
        const defaultLayout = [50, 50];
        const columns = defaultLayout.map((width: number) => ({
          id: `col-${uuidv4()}`,
          width,
          blocks: [] as Block[],
        }));

        const columnData = {
          columns,
          gapSize: "medium",
          stackOnMobile: true,
        };

        const blockWithData = { type, data: columnData };

        console.log("Adding column block with default layout:", defaultLayout);
        onAddBlock(blockWithData);
      } else {
        // Handle variants
        const columns = layout.map((width: number) => ({
          id: `col-${uuidv4()}`,
          width,
          blocks: [] as Block[],
        }));

        const columnData = {
          columns,
          gapSize: "medium",
          stackOnMobile: true,
        };

        const blockWithData = { type, data: columnData };
        console.log("Adding column block with layout:", layout);
        onAddBlock(blockWithData);
      }

      setShowBlockMenu(false);
      return;
    }

    if (blockTypeData === "columns") {
      setShowBlockMenu(true);
      return;
    }

    // Handle regular block types
    console.log("Adding block of type:", blockTypeData);
    if (afterIndex >= 0) {
      onAddBlock({ type: blockTypeData, afterIndex });
    } else {
      onAddBlock(blockTypeData);
    }
    setShowBlockMenu(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/' && !showBlockMenu) {
      e.preventDefault();
      setShowBlockMenu(true);
    } else if (e.key === 'Escape' && showBlockMenu) {
      setShowBlockMenu(false);
    }
  };
  const columnsVariants = [
    {
      label: "50/50",
      value: "50-50",
      layout: [50, 50],
      type: "columns",
    },
    {
      label: "33/33/33",
      value: "33-33-33",
      layout: [33, 33, 33],
      type: "columns",
    },
    {
      label: "25/25/25/25",
      value: "25-25-25-25",
      layout: [25, 25, 25, 25],
      type: "columns",
    },
    {
      label: "20/20/20/20/20",
      value: "20-20-20-20-20",
      layout: [20, 20, 20, 20, 20],
      type: "columns",
    },
    {
      label: "16/16/16/16/16/16",
      value: "16-16-16-16-16-16",
      layout: [16, 16, 16, 16, 16, 16],
      type: "columns",
    },
    { label: "Skip", value: "skip", type: "columns", variant: "skip" },
  ];

  return (
    <div className="h-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <Card className="min-h-[calc(100vh-12rem)] bg-[#f5f2eb] border-transparent shadow-sm" >
        <CardContent className="p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <Input
              placeholder="Add title"
              className="text-3xl font-semibold border-none bg-transparent shadow-none focus-visible:ring-0 placeholder-gray-400 italic"
            />

            {blocks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">
                  Type / to choose a block
                </p>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-slate-800 text-white hover:bg-slate-700"
                  onClick={() => setShowBlockMenu(true)}
                >
                  <Plus className="h-4 w-4"/>
                </Button>

                {showBlockMenu && (
                  <div className="mt-4 bg-white rounded-md shadow-md p-2 max-w-md mx-auto">
                    <Input
                      className="mb-2"
                      placeholder="Search for a block type..."
                      value={blockSearchTerm}
                      onChange={(e) => setBlockSearchTerm(e.target.value)} 
                      autoFocus
                    />
                    <BlockSelector 
                      onSelectBlock={handleAddBlock} 
                      searchTerm={blockSearchTerm}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4" >
                <DraggableBlockList 
                  blocks={blocks}
                  onUpdateBlock={onUpdateBlock} 
                  onRemoveBlock={onRemoveBlock}
                  onReorderBlocks={handleDragEnd}
                  onAddBlock={handleAddBlock}
                />
                
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-slate-800 text-white hover:bg-slate-700"
                    onClick={() => setShowBlockMenu(true)}
                  > 
                    <Plus className="h-4 w-4" />
                  </Button>

                  {showBlockMenu && (
                    <div className="absolute mt-10 bg-white rounded-md shadow-md p-2 w-96 z-50" >
                      {blockSearchTerm === "columns" && (
                        <div className="flex flex-wrap gap-2">
                          {columnsVariants.map((variant) => (
                            <button
                              key={variant.value}
                              onClick={() =>
                                handleAddBlock({
                                  ...variant,
                                  variant: variant.variant,
                                  layout: variant.layout,
                                })
                              }
                              className="bg-gray-200 hover:bg-gray-300 rounded-md px-3 py-1 text-sm"
                            >
                              {variant.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {blockSearchTerm !== "columns" && (
                        <>
                          <Input
                            className="mb-2"
                            placeholder="Search for a block type..."
                            value={blockSearchTerm}
                            onChange={(e) => setBlockSearchTerm(e.target.value)}
                            autoFocus
                          />
                          <BlockSelector onSelectBlock={handleAddBlock} searchTerm={blockSearchTerm} />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleContent;
