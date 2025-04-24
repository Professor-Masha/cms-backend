import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import { ColumnsBlockSettings } from './ColumnsBlockSettings';
import {  } from '@tiptap/react';
import { MoreHorizontal, Move, AlignLeft, AlignCenter, AlignRight, LayoutGrid, Copy, Layers, Group, Ungroup, AlignVerticalBottom, AlignVerticalCenter, AlignVerticalTop, ChevronUp, ChevronDown } from 'lucide-react';
import { Block } from '@/types/cms';
import BlockRenderer from '../BlockRenderer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { CoverBlock, ButtonBlock } from '.';
import { AlignJustify, AlignLeft as AlignLeftIcon, AlignRight as AlignRightIcon, Columns } from 'lucide-react';

import {
  Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


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
    columnAlignment?: 'left' | 'center' | 'right' | 'justify';
    contentAlignment?: 'top' | 'center' | 'bottom' ;
    alignment?: 'none' | 'wide' | 'full';
    showSettings?:boolean
  };
  onChange: (data: any) => void;
}

const gapMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'gap-3',
  medium: 'gap-5',
  large: 'gap-8',
};

// Define column variations
const columnVariations = [
  { label: '100', widths: [100], numColumns: 1 },
  { label: '50 / 50', widths: [50, 50], numColumns: 2 },
  { label: '33 / 66', widths: [33, 66], numColumns: 2 },
  { label: '66 / 33', widths: [66, 33], numColumns: 2 },
  { label: '33 / 33 / 33', widths: [33, 33, 33], numColumns: 3 },
  { label: '25 / 50 / 25', widths: [25, 50, 25], numColumns: 3 },
];

type blockType = 'paragraph' | 'cover' | 'button' | 'columns';


// Helper: get Tailwind grid style for column
const getColumnStyle = (width: number, unit: string = '%') => {
  if (unit === '%') return { width: `${width}%` };
  return { flex: `0 0 auto`, width: `${width}${unit}` };
};

// Helper: get alignment classes
const getAlignmentClasses = (alignment?: 'left' | 'center' | 'right' | 'justify') => {
  switch (alignment) {
    case 'left': return 'justify-start text-left';
    case 'center': return 'justify-center text-center';
    case 'right': return 'justify-end text-right';
    case 'justify': return 'justify-between text-justify';
    default: return '';
  }
};

const getVerticalAlignmentClasses = (alignment?: 'top' | 'center' | 'bottom') => {
  switch (alignment) {
    case 'top': return 'items-start';
    case 'center': return 'items-center';
    case 'bottom': return 'items-end';
    default: return 'items-start'; // Default to top
  }
};



const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ data, onChange, }) => {
  const [showVariationSelector, setShowVariationSelector] = useState(!data.columns.length);
  const [selectedTransformOption, setSelectedTransformOption] = useState<'group' | 'unwrap' | null>(null);
   const [showSettings, setShowSettings] = useState(false);
  // Handlers for adding/removing blocks inside a column
  const handleAddBlock = (colIdx: number, type: blockType = 'paragraph') => {
    const columns = data.columns.map((col, idx) => {
        if (idx !== colIdx) return col;
      return {
        ...col,
        blocks: [
          ...col.blocks.map(b => ({
            ...b,
            order: b.order + 1
          })).sort((a, b) => {
            if (a.order > b.order) return 1
            else if (a.order < b.order) return -1
            else return 0
        }),
            type === 'paragraph' && {
                id: `temp-${Date.now()}-${Math.random()}`,
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
            },
            type === 'cover' && {
                id: `temp-${Date.now()}-${Math.random()}`,
                article_id: '',
                type: 'cover',
                order: 0,
                data: {
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            type === 'button' && {
                id: `temp-${Date.now()}-${Math.random()}`,
                article_id: '',
                type: 'button',
                order: 0,
                data: {
                    text: 'Add text...',
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
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
    const columns = [...data.columns].map((col, idx) => {
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
    const columns = [...data.columns].map((col, idx) => {
      if (idx !== colIdx) return col;
      const newBlocks = [...col.blocks];
      newBlocks.splice(blockIdx, 1);
      return { ...col, blocks: newBlocks };
    });
    onChange({ ...data, columns });
  };

  const handleMoveBlock = useCallback(
    (colIdx: number, blockIdx: number, direction: 'up' | 'down') => {
      const columns = [...data.columns];
      const col = { ...columns[colIdx] };
      const blocks = [...col.blocks];
      if (direction === 'up' && blockIdx > 0) {
        // Swap the blocks
        [blocks[blockIdx], blocks[blockIdx - 1]] = [blocks[blockIdx - 1], blocks[blockIdx]];
        // Update the order values
        blocks[blockIdx].order = blockIdx;
        blocks[blockIdx-1].order = blockIdx -1
      } else if (direction === 'down' && blockIdx < blocks.length - 1) {
        // Swap the blocks
        [blocks[blockIdx], blocks[blockIdx + 1]] = [blocks[blockIdx + 1], blocks[blockIdx]];
         // Update the order values
         blocks[blockIdx].order = blockIdx;
         blocks[blockIdx+1].order = blockIdx + 1
      }
      col.blocks = blocks;
      columns[colIdx] = col;
      onChange({ ...data, columns });
    },
    [data, onChange],
  );

  // Get spacing between columns
  const gapClass = gapMap[data.gapSize] || gapMap.medium;

  // Get alignment classes
  const columnAlignClass = getAlignmentClasses(data.columnAlignment);


  const contentAlignClass = getAlignmentClasses(data.contentAlignment);
  const verticalAlignClass = getVerticalAlignmentClasses(data.contentAlignment);
  // Function to handle adding a new column
  const handleAddColumn = () => {
    if (data.columns.length >= 6) {
      // Limit to 6 columns
      return;
    }
    const newColumn = {
      id: `col-${Date.now()}`,
      width: 100 / (data.columns.length + 1),
      widthUnit: '%',
      blocks: [],
    };
    const updatedColumns = [...data.columns, newColumn].map((col) => ({
       ...col,
        width: 100 / (data.columns.length + 1),
        widthUnit: '%',
    }));
    onChange({ ...data, columns: updatedColumns, gapSize: 'medium' });
  };

  // Function to handle removing a column
  const handleRemoveColumn = (colIdx: number) => {
    if (data.columns.length <= 1) {
      // Cannot have less than 1 column
      return;
    }
    const updatedColumns = data.columns
      .filter((_, idx) => idx !== colIdx)
      .map((col) => ({
        ...col,
         width: 100 / (data.columns.length - 1),
         widthUnit: '%',
      }));
    onChange({ ...data, columns: updatedColumns });
  };

  // Mobile stack class
  const mobileStackClass = data.stackOnMobile ? 'flex-col md:flex-row' : '';

  // Handle selecting a column variation
    const getAlignmentClass = (alignment: string | undefined) => {
        switch (alignment) {
            case 'wide':
                return 'w-full';
            case 'full':
                return 'w-full max-w-full';
            default:
                return 'w-full';
        }
    };


    const alignmentClass = getAlignmentClass(data.alignment);
    
    const handleAlignmentChange = (newAlignment: 'none' | 'wide' | 'full') => {
        onChange({
            ...data,
            alignment: newAlignment,
        });
    };

  const handleSelectVariation = (widths: number[]) => {
    const newColumns = widths.map((width, index) => ({
      id: `col-${Date.now()}-${index}`,
      width,
      widthUnit: '%',
      blocks: [],
    }));
    onChange({ ...data, columns: newColumns });

    setShowVariationSelector(false);
  };

  const handleSkipVariation = () => {
    handleSelectVariation([50, 50]);
  };

  const handleTransform = () => {
        if (selectedTransformOption === 'group') {
            // Logic to transform Columns Block into Group block
            // This may involve converting the current block structure into a Group block format
            console.log('Transforming to Group block...');
            
        } else if (selectedTransformOption === 'unwrap') {
            // Logic to unwrap the contents of the Columns Block
            // This may involve moving all blocks out of the columns and into the main content
             const unwrapContent = () => {
                  const unwrappedBlocks = data.columns.flatMap((column) => column.blocks);
                  const updatedData = {
                      ...data,
                      columns: [
                          {
                             blocks: []
                          }
                      ],
                      unwrappedBlocks,
                  };

                  onChange(updatedData);
                };

                unwrapContent()
            console.log('Unwrapping content...');
        }
    };

  // Show variation selector
    const [addColumnPopoverOpen, setAddColumnPopoverOpen] = useState(false);
   
    
  if (showVariationSelector ) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-4 border border-dashed border-gray-300 rounded-md">
        <h3 className="text-lg font-medium mb-4">Columns</h3>
        <p className="mb-4">Select a variation to start with.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {columnVariations.map((variation) => (
            <button
              key={variation.label}
              onClick={() => handleSelectVariation(variation.widths)}
              className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-md hover:bg-gray-100"
            >
             <div className=' text-xs'>{variation.label}</div>
            </button>
          ))}
        </div>
        <button onClick={handleSkipVariation} className="mt-4 text-sm text-blue-500 hover:underline">
      Skip
        </button>
      </div>
    );
  }

    // Function to handle updating the number of columns
    const handleUpdateColumns = (newColumnCount: number) => {
        if (newColumnCount > 6 || newColumnCount < 1) return;

        const currentColumnCount = data.columns.length;
        const columnDifference = newColumnCount - currentColumnCount;

        if (columnDifference > 0) {
            // Adding columns
            const newColumns = [];
            for (let i = 0; i < columnDifference; i++) {
                newColumns.push({
                    id: `col-${Date.now()}-${data.columns.length + i}`,
                    width: 100 / newColumnCount,
                    widthUnit: '%',
                    blocks: [],
                });
            }
            const updatedColumns = [...data.columns, ...newColumns].map((col) => ({
                ...col,
                width: 100 / newColumnCount,
                 widthUnit: '%',
            }));
            onChange({ ...data, columns: updatedColumns, gapSize: 'medium' });
        } else if (columnDifference < 0) {
            // Removing columns
            const updatedColumns = data.columns.slice(0, newColumnCount).map((col) => ({
                ...col,
                width: 100 / newColumnCount,
                 widthUnit: '%',
            }));
             onChange({ ...data, columns: updatedColumns });

        }
      
      setAddColumnPopoverOpen(false);
    };

    useEffect(() => {
        if(data.columns.length > 1) {
            setAddColumnPopoverOpen(false)
        }
    }, [data.columns])

    const toggleSettings = () => {
        onChange({
            ...data,
            showSettings: !showSettings,
        });
         setShowSettings(!showSettings)
    };

    return (
        <div className={`flex ${gapClass} ${mobileStackClass} ${columnAlignClass} ${alignmentClass}`}
            style={{ minHeight: 120 }}
           >
      {data.columns.map((column, colIdx) => (
        <div
          key={column.id}
          onMouseEnter={(event) => {
            const removeButton = event.currentTarget.querySelector('.remove-column-button');
            if (removeButton) {
              removeButton.classList.remove('hidden');
            }
          }}
          onMouseLeave={(event) => {
            const removeButton = event.currentTarget.querySelector('.remove-column-button');
            if (removeButton) removeButton.classList.add('hidden');
          }}
          style={getColumnStyle(column.width, column.widthUnit || '%')}
          className={`bg-[#f6f6f7] rounded-md p-4 flex flex-col border border-gray-200 min-h-[100px] transition-shadow relative group ${contentAlignClass}`}
        >       
          <div className='flex gap-2 mb-4'>
            <Popover>
                <PopoverTrigger asChild>
                   <Button type="button" variant="outline" size="icon" className="rounded-full">
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                 <PopoverContent className="w-[150px] flex flex-col">
                  <Button
                                variant="ghost"
                                className=' w-full justify-start gap-2'
                                onClick={() => {
                                    setSelectedTransformOption('group')
                                    handleTransform()
                                }}
                            >
                                <Group className='w-4 h-4' /> <span>Group</span>
                            </Button>

                           <Button
                                variant="ghost"
                                className='w-full justify-start gap-2'
                                onClick={() => {
                                    setSelectedTransformOption('unwrap');
                                    handleTransform();
                                }}
                            >
                                <Ungroup className='w-4 h-4' /> <span>Unwrap</span>
                            </Button>
                </PopoverContent>
            </Popover>

            <Button type="button" variant="outline" size="icon" className="rounded-full">
                        <Move className="w-4 h-4" />
                    </Button>

             <Popover>
                   <PopoverTrigger asChild>
                     <Button type="button" variant="ghost" size="icon" className="rounded-full">
                            <AlignVerticalTop className="w-4 h-4" />
                     </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-[200px] text-center">
                   <div className=' flex flex-col gap-2'>
                       <Button
                         onClick={() => onChange({...data, contentAlignment: 'top'})}
                         variant="ghost"
                       >
                          <AlignVerticalTop className='w-4 h-4'/>
                        </Button>
                        <Button
                          onClick={() => onChange({...data, contentAlignment: 'center'})}
                          variant="ghost"
                        >
                           <AlignVerticalCenter className='w-4 h-4'/>
                        </Button>
                        <Button
                           onClick={() => onChange({...data, contentAlignment: 'bottom'})}
                          variant="ghost"
                        >
                           <AlignVerticalBottom className='w-4 h-4'/>
                        </Button>
                   </div>
                 </PopoverContent>
             </Popover>

            <Popover>
              <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full">
                       <AlignLeftIcon className="w-4 h-4" />
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] text-center">
                  <div className=' flex flex-col gap-2'>
                       <Button
                           onClick={() => handleAlignmentChange('none')}
                            variant="ghost"
                        >
                          <AlignJustify className='w-4 h-4' /><span>None</span>
                        </Button>
                        <Button
                         onClick={() => handleAlignmentChange('wide')}
                         variant="ghost"
                       >
                          <Columns className='w-4 h-4' /><span>Wide width</span>
                        </Button>
                        <Button
                           onClick={() => handleAlignmentChange('full')}
                           variant="ghost"
                       >
                          <AlignRightIcon className='w-4 h-4' /><span>Full width</span>
                        </Button>
                   </div>
              </PopoverContent>
             </Button>
             <Button type="button" variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-4 h-4" />
                </Button>
            <Button type="button" onClick={() => toggleSettings()} variant="ghost" size="icon" className="rounded-full">
                            <Layers className="w-4 h-4" /> </Button>
             </div>
                <div className='flex gap-4'>
                            {column.blocks.map((block, blockIdx) => (

                                <button onClick={() => handleAddBlock(colIdx)} className="  flex  text-center gap-2  border border-dashed border-gray-300 rounded-md items-center justify-center   w-8 h-8 ">
                                     <Plus className="w-4 h-4" />
                                       <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center opacity-0 group-hover:opacity-100">
                                        <Button onClick={() => handleAddBlock(colIdx, 'paragraph')} variant={'ghost'} size={'sm'} className="w-fit h-fit px-2">
                                           Paragraph
                                        </Button>
                                        <Button onClick={() => handleAddBlock(colIdx, 'cover')} variant={'ghost'} size={'sm'} className="w-fit h-fit px-2">
                                            Cover
                                        </Button>
                                        <Button onClick={() => handleAddBlock(colIdx, 'button')} variant={'ghost'} size={'sm'} className="w-fit h-fit px-2">
                                           Button
                                        </Button>

                                        </div>
                                </button>
                            ))}

                </div>
          {column.blocks && column.blocks.length > 0 ? (
            column.blocks.sort((a,b) => a.order - b.order).map((block, blockIdx) => (
              <div key={block.id} className="mb-2">
              <div className="flex gap-2 items-center mb-2">
                  <Popover>
                    <PopoverTrigger asChild>
                         <Button type="button" variant="outline" size="icon" className="rounded-full">
                          <Move className="w-4 h-4" />
                       </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[150px] text-center">
                        <div className=' flex flex-col gap-2'>
                            <Button
                                disabled={blockIdx === 0}
                                onClick={() => handleMoveBlock(colIdx, blockIdx, 'up')}
                                variant="ghost"
                            >
                                <ChevronUp className='w-4 h-4'/>
                            </Button>
                             <Button
                                 disabled={blockIdx === column.blocks.length -1}
                                onClick={() => handleMoveBlock(colIdx, blockIdx, 'down')}
                                variant="ghost"
                              >
                                <ChevronDown className='w-4 h-4'/>
                              </Button>
                         </div>
                    </PopoverContent>
                 </Popover>

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
              
               
              
              
              

                }
              </div>
            )).filter(Boolean)
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground italic text-xs opacity-85">
               
            </div>
          )}
          <Button type="button" 
            variant="outline"
            size="icon" 
            className="rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white shadow group-hover:shadow-md border-gray-300 z-10"
            onClick={() => {handleAddBlock(colIdx)}}
            aria-label="Add block to column"
          >
            <Plus className="w-4 h-4" />
          </Button>          
        </div>
      )) }
            {data.columns.length < 6 && (
                <Popover open={addColumnPopoverOpen} onOpenChange={setAddColumnPopoverOpen}>
                   <PopoverTrigger asChild>
                       <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full w-full h-full border-dashed border-gray-300"
                            aria-label="Add column"
                        >
                            Add column
                        </Button>
                   </PopoverTrigger>
                    <PopoverContent className="w-[200px] text-center">
                       <div className=' flex justify-center items-center'>
                             <div className='w-fit'>
                        {
                            [...Array(6)].map((_, index) => (
                                <Button
                                key={index + 1}
                                variant={'ghost'}
                                size={'sm'}
                                disabled={data.columns.length === index + 1}
                                className='w-10 h-10 px-0'
                                onClick={() => handleUpdateColumns(index + 1)}
                                >
                                 <div className='flex flex-col'>
                                <span className='text-[10px] font-bold'> {index + 1}</span>
                                <span className='text-[8px] text-gray-500'> Columns</span>
                                 </div>
                                </Button>
                            ))
                        }
                             </div>

                       </div>

                    </PopoverContent>
                </Popover>
      ))}
    </div>
      {showSettings && <ColumnsBlockSettings data={data} onChange={onChange} />}
  );
};

export default ColumnsBlock;

