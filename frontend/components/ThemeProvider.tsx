
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabaseClient";

const ThemeContext = createContext({
  dark: false,
  setDark: (dark: boolean) => {},
  saveThemePreference: (theme: string) => Promise.resolve(),
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState(() => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const loadUserPreferences = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) {
          if (data.theme === 'dark') setDark(true);
          else if (data.theme === 'light') setDark(false);
          // If 'system', we already set according to system preference
        }
      }
    };

    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const saveThemePreference = async (theme: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: session.user.id, 
          theme,
          updated_at: new Date().toISOString() 
        });
    }
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark, saveThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
