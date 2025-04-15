
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionPreviewProps {
  items: AccordionItemData[];
  style: 'default' | 'bordered' | 'simple';
  multiple: boolean;
  collapsible: boolean;
}

const AccordionPreview: React.FC<AccordionPreviewProps> = ({
  items,
  style,
  multiple,
  collapsible
}) => {
  const styleClass = 
    style === 'bordered' ? 'border rounded-md p-1' :
    style === 'simple' ? 'space-y-1' : '';

  if (multiple) {
    return (
      <Accordion
        type="multiple"
        defaultValue={items.map(item => item.id)}
        className={styleClass}
      >
        {items.map(item => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <Accordion
      type="single"
      defaultValue={items.length > 0 ? items[0].id : undefined}
      collapsible={collapsible}
      className={styleClass}
    >
      {items.map(item => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionPreview;
