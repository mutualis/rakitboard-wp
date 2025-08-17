import { useState, useEffect } from "react";
import { wordpressApi, type Category } from "../services/wordpressApi.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";
import { Button } from "./ui";

interface CategorySelectorProps {
  onCategoryChange: (categorySlug: string) => void;
  selectedCategory: string;
}

function CategorySelector({
  onCategoryChange,
  selectedCategory,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await wordpressApi.getCategories();
        const activeCategories = categoriesData
          .filter((cat) => cat.count > 0 && cat.slug !== "uncategorized")
          .slice(0, 8);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-48 h-10 bg-white/20 rounded-lg animate-pulse"></div>
        <div className="w-32 h-10 bg-white/20 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white placeholder:text-white/70">
          <SelectValue placeholder="Pilih Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name} ({category.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && selectedCategory !== "all" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCategoryChange("all")}
          className="border-white/30 text-white hover:bg-white hover:text-blue-600"
        >
          Reset
        </Button>
      )}
    </div>
  );
}

export default CategorySelector;
