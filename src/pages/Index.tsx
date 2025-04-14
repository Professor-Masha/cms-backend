
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
        }
      );
      
      return () => subscription.unsubscribe();
    };
    
    fetchUser();
  }, []);

  const handleLogin = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>ModularCMS</CardTitle>
            <CardDescription>
              A flexible content management system with block-based editing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to access the CMS dashboard.</p>
            <Button onClick={handleLogin} className="w-full">Sign In</Button>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            New to ModularCMS? <a href="/auth" className="ml-1 underline">Create an account</a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ModularCMS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button 
              variant="outline" 
              onClick={async () => {
                await supabase.auth.signOut();
                toast({ title: "Signed out successfully" });
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardOverview user={user} />
          </TabsContent>
          
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Manage your content articles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Create</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Create a new article with rich content blocks.</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button onClick={() => navigate('/articles/new')}>
                        Create New Article
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Manage</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Browse and manage all your articles.</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline">
                        View All Articles
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Manage categories and tags for your content.</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline">
                        Manage Categories
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>Manage your uploaded media files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Media Library</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Browse and manage all your media files.</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button onClick={() => navigate('/media')}>
                        Open Media Library
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Upload new media files to your library.</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" onClick={() => navigate('/media')}>
                        Upload New Files
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your CMS preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The settings interface will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
