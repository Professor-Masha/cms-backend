
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qdedlkgysrlyrhtvtyey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWRsa2d5c3JseXJodHZ0eWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTY5MTUsImV4cCI6MjA2MDE5MjkxNX0.kHR_14KdxzDs6Mj6WPGw7ZvTXAmrDXNWRxc7N5fkXg8";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const trackArticleView = async (
  articleId: string, 
  timeSpent?: number, 
  device?: string,
  referrer?: string
) => {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  // Use the RPC function we created in the database
  return supabase.rpc('track_article_view', {
    article_uuid: articleId,
    user_uuid: userId || null,
    time_spent: timeSpent || null,
    device: device || null,
    referrer_url: referrer || null
  });
};

export const addBookmark = async (articleId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Must be logged in to bookmark articles');
  }
  
  return supabase.from('bookmarks').upsert({
    user_id: session.user.id,
    article_id: articleId,
    created_at: new Date().toISOString()
  });
};

export const removeBookmark = async (articleId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Must be logged in to remove bookmarks');
  }
  
  return supabase.from('bookmarks')
    .delete()
    .eq('user_id', session.user.id)
    .eq('article_id', articleId);
};

export const getBookmarks = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { data: [] };
  }
  
  return supabase.from('bookmarks')
    .select('*, articles(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
};
