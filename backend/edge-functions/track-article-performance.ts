
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const url = new URL(req.url);
    const endpoint = url.pathname.split("/").pop();

    // Return user activity trends (for admin dashboard)
    if (endpoint === "activity-trends") {
      // Check authorization token
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const token = authHeader.split(" ")[1];
      
      // Verify the token using Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Check if the user is an admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (profileError || profile?.role !== "admin") {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Admin access required" }),
          { 
            status: 403, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Fetch activity data
      const { data, error } = await supabase
        .from("user_activity")
        .select(`
          id,
          user_id,
          article_id,
          action,
          time_spent,
          device_type,
          created_at,
          articles:article_id(title, slug)
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Get device distribution
      const { data: deviceData, error: deviceError } = await supabase
        .rpc("get_device_distribution");
        
      if (deviceError) throw deviceError;
      
      // Get average time spent per article
      const { data: timeData, error: timeError } = await supabase
        .rpc("get_avg_time_spent_per_article");
        
      if (timeError) throw timeError;
      
      return new Response(
        JSON.stringify({ 
          activities: data,
          deviceDistribution: deviceData,
          timeSpentAnalytics: timeData
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Return recommended articles for a specific user
    if (endpoint === "recommended-articles") {
      const { userId } = await req.json();
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "User ID is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // First get user interests from profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("interests")
        .eq("id", userId)
        .single();
        
      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }
      
      const interests = profile?.interests || [];
      
      // Get articles based on user interests
      let query = supabase
        .from("articles")
        .select(`
          *,
          categories:article_categories(categories(*))
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(8);
      
      // If user has interests, prioritize those articles
      if (interests.length > 0) {
        query = supabase
          .from("articles")
          .select(`
            *,
            categories:article_categories(categories(*))
          `)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .in("category_id", interests)
          .limit(8);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ recommended: data }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid endpoint" }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
