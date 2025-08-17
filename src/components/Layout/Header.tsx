import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { wordpressApi, type Category } from "../../services/wordpressApi.ts";
import CommandSearch from "../CommandSearch.tsx";
import { ThemeToggle } from "../ThemeToggle.tsx";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Menggunakan getCategoriesParentOnly untuk hanya mendapatkan parent categories
        const parentCategories = await wordpressApi.getCategoriesParentOnly();
        // Filter out 'Uncategorized' category dan pastikan hanya parent categories (parent === 0)
        const filteredCategories = parentCategories.filter(
          (category) =>
            category.slug !== "uncategorized" && category.parent === 0
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              RakitBoard
            </Link>
            <div className="hidden md:flex space-x-6">
              <div className="animate-pulse bg-muted h-4 w-16 rounded"></div>
              <div className="animate-pulse bg-muted h-4 w-20 rounded"></div>
              <div className="animate-pulse bg-muted h-4 w-18 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            RakitBoard
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/categories"
              className="text-foreground hover:text-primary uppercase text-sm font-medium transition-colors"
            >
              Kategori
            </Link>
            <Link
              to="/components"
              className="text-foreground hover:text-primary uppercase text-sm font-medium transition-colors"
            >
              Components
            </Link>
            <div className="w-64">
              <CommandSearch />
            </div>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <Link
              to="/categories"
              className="block py-2 text-foreground hover:text-primary uppercase font-medium transition-colors"
            >
              Kategori
            </Link>
            <Link
              to="/components"
              className="block py-2 text-foreground hover:text-primary uppercase font-medium transition-colors"
            >
              Components
            </Link>
            <div className="py-2">
              <CommandSearch />
            </div>
            <div className="py-2">
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
