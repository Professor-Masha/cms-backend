export type BlockType = 
  // Core blocks
  | 'text'
  | 'heading'
  | 'list'
  | 'quote'
  | 'button'
  | 'divider'
  | 'navigation'
  
  // Media blocks
  | 'image'
  | 'gallery'
  | 'video'
  | 'audio'
  | 'hero'
  | 'embed'
  | 'code'
  | 'social'
  | 'map'
  
  // Layout blocks
  | 'columns'
  | 'group'
  | 'row'
  | 'stack'
  
  // Advanced blocks
  | 'recentPosts'
  | 'search'
  | 'form'
  | 'calendar'
  | 'accordion'
  | 'pricing'
  | 'countdown'
  | 'html'
  | 'table';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ArticleStatus;
  featured_image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  keywords?: string[]; // Explicitly marked as optional
}

export interface Block {
  id: string;
  article_id: string;
  type: BlockType;
  order: number;
  data: any;
  created_at: string;
  updated_at: string;
  parent_id?: string; // For nested blocks
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'writer';
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  alt_text: string | null;
  caption: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  article_id: string;
  category_id: string;
}

export interface ArticleTag {
  article_id: string;
  tag_id: string;
}
