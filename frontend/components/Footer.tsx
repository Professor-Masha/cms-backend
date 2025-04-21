
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type SocialLinks = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
};

const iconMap: Record<string, JSX.Element> = {
  facebook: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 11.07C22 5.862 17.523.5 12 .5S2 5.862 2 11.071c0 5.022 3.657 9.24 8.438 9.912v-7.019H7.898v-2.893h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.242 0-1.632.772-1.632 1.562v1.874h2.773l-.443 2.893h-2.33v7.019C18.343 20.31 22 16.093 22 11.07Z" />
    </svg>
  ),
  twitter: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.609 1.794-1.574 2.163-2.724-.95.564-2.004.974-3.127 1.195-.897-.956-2.178-1.555-3.594-1.555-2.723 0-4.927 2.206-4.927 4.928 0 .39.045.766.127 1.127-4.093-.205-7.725-2.165-10.156-5.144-.426.729-.666 1.575-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.025-1.566-.247-2.229-.616v.062c0 2.385 1.693 4.374 3.946 4.829-.413.111-.849.171-1.299.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.416-1.68 1.318-3.809 2.103-6.102 2.103-.397 0-.788-.023-1.175-.069 2.178 1.394 4.768 2.209 7.557 2.209 9.054 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634.961-.69 1.8-1.56 2.46-2.548l-.047-.02Z" />
    </svg>
  ),
  instagram: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.18.056 1.84.24 2.27.405.55.209.941.463 1.357.878.414.416.669.808.878 1.358.165.431.349 1.092.406 2.271.058 1.266.07 1.646.07 4.849s-.012 3.584-.07 4.85c-.057 1.179-.242 1.84-.406 2.271a3.68 3.68 0 0 1-.878 1.357c-.416.415-.808.67-1.358.878-.431.166-1.092.35-2.271.406-1.266.058-1.646.07-4.85.07s-3.583-.012-4.849-.07c-1.179-.057-1.84-.241-2.271-.406a3.674 3.674 0 0 1-1.357-.878A3.683 3.683 0 0 1 2.638 18.22c-.165-.431-.349-1.092-.406-2.271-.058-1.266-.07-1.646-.07-4.85s.012-3.583.07-4.849c.057-1.179.241-1.84.406-2.271A3.678 3.678 0 0 1 4 3.383c.416-.415.808-.669 1.357-.877.431-.166 1.092-.35 2.271-.406C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.012 7.052.07c-1.266.057-2.13.24-2.876.511a5.928 5.928 0 0 0-2.163 1.421A5.92 5.92 0 0 0 .58 4.176c-.271.746-.454 1.61-.511 2.876C0 8.334-.012 8.741-.012 12s.012 3.665.07 4.946c.057 1.266.24 2.13.511 2.876a5.933 5.933 0 0 0 1.421 2.163 5.92 5.92 0 0 0 2.163 1.421c.746.271 1.61.454 2.876.511C8.334 24.012 8.741 24 12 24s3.665.012 4.946-.07c1.266-.057 2.13-.24 2.876-.511a5.932 5.932 0 0 0 2.163-1.421 5.916 5.916 0 0 0 1.421-2.163c.271-.746.454-1.61.511-2.876.058-1.281.07-1.688.07-4.947s-.012-3.665-.07-4.946c-.057-1.266-.24-2.13-.511-2.876a5.93 5.93 0 0 0-1.421-2.163A5.921 5.921 0 0 0 19.824.581c-.746-.271-1.61-.454-2.876-.511C15.666-.012 15.259 0 12 0Zm0 5.838A6.163 6.163 0 1 0 18.163 12 6.171 6.171 0 0 0 12 5.838Zm0 10.176A4.012 4.012 0 1 1 16.013 12 4.017 4.017 0 0 1 12 16.013Zm6.406-11.845A1.44 1.44 0 1 0 19.838 7.6a1.445 1.445 0 0 0-1.432-1.432Z" />
    </svg>
  ),
  youtube: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.022 3.022 0 0 0-2.128-2.139C19.19 3.52 12 3.52 12 3.52s-7.19 0-9.37.527A3.026 3.026 0 0 0 .502 6.186C-.012 8.368-.012 12-.012 12s0 3.632.514 5.814c.285 1.094 1.117 1.926 2.128 2.138C4.81 20.48 12 20.48 12 20.48s7.19 0 9.37-.527a3.024 3.024 0 0 0 2.128-2.138c.526-2.181.514-5.813.514-5.813s.012-3.631-.514-5.813ZM9.546 15.568v-7.136l6.15 3.568Z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C3.35 3.5 2 4.79 2 6.28c0 1.47 1.34 2.77 2.95 2.77h.02A2.72 2.72 0 0 0 8.27 6.29c0-1.47-1.33-2.79-3.29-2.79ZM2 8.87h5.62V21H2V8.87zM20.45 8.95v-1a3.9 3.9 0 0 0-3.79-3.85c-1.99 0-2.61 1.03-3.04 1.76V8.9h-.03c-.02 0-.03.01-.03.03v.14c0 .02 0 .04.01.07.01.03.03.05.04.07.01.02.03.01.06.01h.16c.06 0 .12.01.19.01.61 0 .89-.05 1.23-.09.2-.02.38-.13.38-.37V8.8c0-.25-.18-.37-.38-.38-.36-.03-.65-.03-1.35-.03v-.58S13.94 6 16.66 6c3.02 0 3.67 1.22 3.79 2.97V21h-5.62V8.87h-1.68v12.13h1.68V8.87h5.62V21h-5.62V8.87H21V8.87H20.45z" />
    </svg>
  ),
};

const Footer = () => {
  const [links, setLinks] = useState<SocialLinks>({});
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'social_links')
        .single();
      
      if (data && data.value) {
        setLinks(data.value);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-[#1A1F2C] dark:bg-[#19172b] py-10 mt-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-gradient-primary mb-4 inline-block">
              Info Stream Africa
            </Link>
            <p className="text-gray-300 mt-2 max-w-md">
              Your trusted source for news and insights from across Africa and the world. Stay informed with our comprehensive coverage.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-white transition">Sign In</Link></li>
              <li><Link to="/bookmarks" className="text-gray-300 hover:text-white transition">Bookmarks</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white transition">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex items-center gap-4 mt-2">
              {Object.entries(links).map(
                ([key, value]) =>
                  value && (
                    <a 
                      key={key} 
                      href={value} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-[#8B5CF6] transition"
                      aria-label={`Visit our ${key} page`}
                    >
                      {iconMap[key]}
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {year} Info Stream Africa. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
