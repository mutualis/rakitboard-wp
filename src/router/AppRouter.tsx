import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout.tsx";
import Home from "@/pages/Home.tsx";
import Category from "@/pages/Category.tsx";
import CategoryPosts from "@/pages/CategoryPosts.tsx";
import Post from "@/pages/Post";
import About from "@/pages/About.tsx";
import Categories from "@/pages/Categories.tsx";
import AllPosts from "@/pages/AllPosts.tsx";
import ComponentsDemo from "@/pages/ComponentsDemo.tsx";

function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPosts />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/components" element={<ComponentsDemo />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRouter;
