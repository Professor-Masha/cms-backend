
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface DashboardOverviewProps {
  user: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    mediaItems: 0,
    userRole: 'Loading...',
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user role
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        // In a real implementation, we would fetch actual stats
        // For now, let's use placeholder data
        setStats({
          totalArticles: 0,
          publishedArticles: 0,
          draftArticles: 0,
          mediaItems: 0,
          userRole: profiles?.role || 'User',
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, [user]);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalArticles}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All content pieces in your CMS
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publishedArticles}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Live content visible to users
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.draftArticles}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Work in progress content
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mediaItems}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Images, videos and other media
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Welcome to ModularCMS</CardTitle>
          <CardDescription>
            You are logged in as <span className="font-medium">{stats.userRole}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This dashboard will show you analytics, recent activity, and quick access to your content.
            The CMS backend is currently being set up. More features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
