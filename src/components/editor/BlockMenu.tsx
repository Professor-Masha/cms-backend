
import React from 'react';
import { Button } from '@/components/ui/button';
import BlockSelector from './BlockSelector';
import { BlockType } from '@/types/cms';

interface BlockMenuProps {
  onAddBlock: (blockType: BlockType) => void;
}

const BlockMenu: React.FC<BlockMenuProps> = ({ onAddBlock }) => {
  return (
    <div className="text-center py-4">
      <BlockSelector onSelectBlock={onAddBlock} />
    </div>
  );
};

export default BlockMenu;
