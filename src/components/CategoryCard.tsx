import { Link } from "react-router-dom";
import type { Category } from "../services/wordpressApi.ts";
import { Card, CardContent, CardHeader } from "./ui";
import { Badge } from "./ui";

interface CategoryCardProps {
  category: Category;
  postCount?: number;
}

function CategoryCard({ category, postCount }: CategoryCardProps) {
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("arduino")) return "🔌";
    if (lowerName.includes("esp32") || lowerName.includes("esp8266"))
      return "📡";
    if (lowerName.includes("raspberry") || lowerName.includes("pi"))
      return "🍓";
    if (lowerName.includes("tutorial") || lowerName.includes("guide"))
      return "📚";
    if (lowerName.includes("project")) return "⚡";
    return "🔧";
  };

  const getCategoryColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("arduino")) return "from-orange-500 to-red-500";
    if (lowerName.includes("esp32") || lowerName.includes("esp8266"))
      return "from-blue-500 to-purple-500";
    if (lowerName.includes("raspberry") || lowerName.includes("pi"))
      return "from-green-500 to-emerald-500";
    if (lowerName.includes("tutorial") || lowerName.includes("guide"))
      return "from-indigo-500 to-blue-500";
    if (lowerName.includes("project")) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-slate-500";
  };

  return (
    <Link to={`/category/${category.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(
                category.name
              )} flex items-center justify-center text-2xl`}
            >
              {getCategoryIcon(category.name)}
            </div>
            <Badge variant="secondary" className="text-xs">
              {postCount || category.count} artikel
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
              Jelajahi Kategori →
            </span>
            <div className="w-6 h-6 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCard;
