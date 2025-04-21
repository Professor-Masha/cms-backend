
import React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import CategoryDropdown from "./CategoryDropdown";
import { Link } from "react-router-dom";

const Header = ({ categories }: { categories: { name: string; slug: string }[] }) => {
  const { dark, setDark } = useTheme();

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
