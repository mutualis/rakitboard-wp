import { useState, useEffect } from "react";
import { wordpressApi, type Category } from "../services/wordpressApi.ts";
import CategoryCard from "../components/CategoryCard.tsx";
import { Skeleton } from "../components/ui";
import { Button } from "../components/ui";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await wordpressApi.getCategories();
        // Filter out 'Uncategorized' category
        const filteredCategories = categoriesData.filter(
          (category) => category.slug !== "uncategorized"
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-md mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Jelajahi Kategori
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan kategori tutorial yang sesuai dengan minat dan kebutuhan
          belajar Anda
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Kategori tidak ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Coba ubah kata kunci pencarian Anda
          </p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Reset Pencarian
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Statistik Kategori
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">Total Kategori</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {categories.filter((cat) => cat.count > 0).length}
              </div>
              <div className="text-gray-600">Kategori Aktif</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.reduce((total, cat) => total + cat.count, 0)}
              </div>
              <div className="text-gray-600">Total Artikel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Siap untuk mulai belajar?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Pilih kategori yang menarik minat Anda dan mulailah perjalanan
            belajar elektronik dan pemrograman
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900"
            asChild
          >
            <Link to="/">← Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Categories;
