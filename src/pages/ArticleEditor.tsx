
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ArticleEditor = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Legacy Article Editor</h1>
          <p>This editor has been replaced with the new block-based editor.</p>
          <p className="mt-2">Please use the new editor at <a href="/articles/new" className="text-primary hover:underline">Create New Article</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleEditor;
