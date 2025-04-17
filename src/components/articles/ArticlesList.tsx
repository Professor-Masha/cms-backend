
import React from 'react';
import { format } from 'date-fns';
import { Article } from '@/types/cms';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  onEdit: (id: string) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articles, isLoading, onEdit }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>{getStatusBadge(article.status)}</TableCell>
              <TableCell>
                {article.updated_at 
                  ? format(new Date(article.updated_at), 'MMM d, yyyy') 
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(article.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {article.status === 'published' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticlesList;
