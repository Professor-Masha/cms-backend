
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import { ThemeProvider } from "./components/ThemeProvider";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ArticleView from "./pages/ArticleView";
import Bookmarks from "./pages/Bookmarks";
import { PreviewProvider } from "./components/PreviewProvider";

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <PreviewProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/article/:slug" element={<ArticleView />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </PreviewProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
