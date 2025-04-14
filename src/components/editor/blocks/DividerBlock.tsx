
interface DividerBlockProps {
  data: Record<string, any>;
  onChange: (data: any) => void;
}

const DividerBlock: React.FC<DividerBlockProps> = () => {
  return (
    <div className="py-2">
      <hr className="my-2" />
      <p className="text-center text-sm text-muted-foreground">Divider block</p>
    </div>
  );
};

export default DividerBlock;
