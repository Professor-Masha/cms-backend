
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CodeBlockProps {
  data: {
    content: string;
    language: string;
  };
  onChange: (data: any) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ data, onChange }) => {
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'python', label: 'Python' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'bash', label: 'Bash' },
    { value: 'sql', label: 'SQL' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="code-language">Language</Label>
        <Select
          value={data.language}
          onValueChange={(value) => onChange({ ...data, language: value })}
        >
          <SelectTrigger id="code-language" className="mt-1">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="code-content">Code</Label>
        <Textarea
          id="code-content"
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Enter code here..."
          className="mt-1 font-mono text-sm"
          rows={8}
        />
      </div>
      
      <div className="p-4 border rounded-md">
        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
        <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
          <code>{data.content}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
