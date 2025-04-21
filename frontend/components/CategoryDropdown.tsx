
import React, { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryDropdown = ({ categories }: { categories: { name: string; slug: string }[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center text-white bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] px-4 py-2 rounded shadow hover:from-[#9b87f5] duration-200"
        onClick={() => setOpen((open) => !open)}
        aria-expanded={open}
      >
        <Menu className="mr-2" />
        Categories
        <ChevronDown className="ml-2" />
      </button>
      {open && (
        <div
          className="absolute left-0 mt-2 z-40 w-64 bg-white dark:bg-[#19172b] shadow-2xl rounded-xl py-2"
        >
          {categories.map((cat) => (
            <Link
              to={`/#category-${cat.slug}`}
              key={cat.slug}
              className="block px-5 py-3 text-base text-gray-900 dark:text-white hover:bg-[#F97316]/10 dark:hover:bg-[#1EAEDB]/20 rounded-xl transition"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/about"
            className="block px-5 py-3 text-base text-gray-900 dark:text-white hover:bg-[#F97316]/10 dark:hover:bg-[#1EAEDB]/20 rounded-xl transition"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-5 py-3 text-base text-gray-900 dark:text-white hover:bg-[#F97316]/10 dark:hover:bg-[#1EAEDB]/20 rounded-xl transition"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
