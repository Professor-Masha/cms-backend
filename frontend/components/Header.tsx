
import React, { useState, useEffect } from "react";
import { Menu, Sun, Moon, User, BookmarkIcon, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import CategoryDropdown from "./CategoryDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";

const Header = ({ categories }: { categories: { name: string; slug: string }[] }) => {
  const { dark, setDark } = useTheme();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-tr from-[#1A1F2C] to-[#9b87f5] dark:from-[#110c28] dark:to-[#1EAEDB] shadow-lg relative">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <CategoryDropdown categories={categories} />
          <Link to="/" className="ml-3 text-2xl font-bold text-white tracking-wide">
            Info Stream Africa
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/preview">
            <span className="text-sm px-4 py-1 bg-[#8B5CF6] rounded-full text-white hover:bg-[#1EAEDB] transition">Preview</span>
          </Link>
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 text-white hover:bg-white/20 transition"
              >
                <span className="hidden md:inline">{userProfile?.display_name || user.email}</span>
                <User className="w-5 h-5" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#19172b] rounded-xl shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#28243a]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#28243a]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    <span>Bookmarks</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#28243a] w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              Login / Sign up
            </Link>
          )}
          
          <button
            onClick={() => setDark(!dark)}
            className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Toggle Dark Theme"
          >
            {dark ? <Sun className="text-yellow-300" /> : <Moon className="text-blue-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
