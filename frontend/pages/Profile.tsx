
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../components/ThemeProvider";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../hooks/useToast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dark, setDark, saveThemePreference } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    display_name: "",
    avatar_url: "",
    bio: "",
    interests: [] as string[],
  });
  const [preferences, setPreferences] = useState({
    theme: dark ? "dark" : "light",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user && !authLoading) {
        navigate("/auth");
        return;
      }

      if (user) {
        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Fetch categories for interests
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (profileData) {
          setProfile({
            display_name: profileData.display_name || "",
            avatar_url: profileData.avatar_url || "",
            bio: profileData.bio || "",
            interests: profileData.interests || [],
          });
        }

        if (categoriesData) {
          setCategories(categoriesData);
        }
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      await updateProfile({
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        interests: profile.interests,
      });
      
      // Save theme preference
      if (preferences.theme === "dark") {
        setDark(true);
      } else if (preferences.theme === "light") {
        setDark(false);
      }
      
      await saveThemePreference(preferences.theme);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInterestToggle = (categoryId: string) => {
    setProfile(prev => {
      const interests = [...prev.interests];
      
      if (interests.includes(categoryId)) {
        return {
          ...prev,
          interests: interests.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, categoryId]
        };
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
        <div className="animate-pulse bg-white/20 dark:bg-white/10 rounded-lg p-12">
          <div className="w-64 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F1F1F1] to-[#E5E5E5] dark:from-[#1A1F2C] dark:to-[#19172b]">
      <Header categories={[]} />
      
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#19172b] rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] p-8 text-white">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="mt-2 text-white/80">
              Update your profile and personalize your experience
            </p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.display_name}
                    onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#28243a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#28243a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Enter URL for your avatar"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#28243a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme Preference
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={preferences.theme === "light"}
                      onChange={() => setPreferences({...preferences, theme: "light"})}
                      className="h-4 w-4 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Light</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={preferences.theme === "dark"}
                      onChange={() => setPreferences({...preferences, theme: "dark"})}
                      className="h-4 w-4 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Dark</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={preferences.theme === "system"}
                      onChange={() => setPreferences({...preferences, theme: "system"})}
                      className="h-4 w-4 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">System</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Interests
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map(category => (
                    <label key={category.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.interests.includes(category.id)}
                        onChange={() => handleInterestToggle(category.id)}
                        className="h-4 w-4 text-[#8B5CF6] focus:ring-[#8B5CF6] rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] text-white rounded-lg font-medium hover:from-[#1EAEDB]/90 hover:to-[#8B5CF6]/90 transition focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
