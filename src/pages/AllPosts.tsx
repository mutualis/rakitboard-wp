import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  wordpressApi,
  type Post,
  type Category,
} from "../services/wordpressApi.ts";
import PostCard from "../components/PostCard.tsx";
import { Button } from "../components/ui";
import { Input } from "../components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui";
import { Skeleton } from "../components/ui";
import { Separator } from "../components/ui";

function AllPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories for filter
        const categoriesData = await wordpressApi.getCategories();
        const filteredCategories = categoriesData.filter(
          (category) => category.slug !== "uncategorized"
        );
        setCategories(filteredCategories);

        // Fetch posts
        const postsData = await wordpressApi.getPosts({
          per_page: postsPerPage,
          page: currentPage,
        });
        setPosts(postsData);
        setHasMore(postsData.length === postsPerPage);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const loadMorePosts = async () => {
    try {
      const nextPage = currentPage + 1;
      const morePosts = await wordpressApi.getPosts({
        per_page: postsPerPage,
        page: nextPage,
      });

      if (morePosts.length > 0) {
        setPosts((prev) => [...prev, ...morePosts]);
        setCurrentPage(nextPage);
        setHasMore(morePosts.length === postsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.rendered.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      post._embedded?.["wp:term"]?.[0]?.some(
        (cat) => cat.slug === selectedCategory
      );

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
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
          Semua Artikel
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Jelajahi semua tutorial dan artikel seputar elektronik dan pemrograman
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Kategori" />
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
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Menampilkan {filteredPosts.length} artikel
          {selectedCategory !== "all" &&
            ` dalam kategori "${
              categories.find((c) => c.slug === selectedCategory)?.name
            }"`}
          {searchTerm && ` yang mengandung "${searchTerm}"`}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && filteredPosts.length === posts.length && (
            <div className="text-center">
              <Button
                onClick={loadMorePosts}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                Muat Lebih Banyak Artikel
              </Button>
            </div>
          )}

          {/* No More Posts */}
          {!hasMore && (
            <div className="text-center text-gray-500 py-8">
              Tidak ada lagi artikel untuk dimuat
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Reset Filter
            </Button>
            <Button asChild>
              <Link to="/categories">Jelajahi Kategori</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Ingin melihat yang spesifik?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/categories">Jelajahi Kategori</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/">← Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AllPosts;
