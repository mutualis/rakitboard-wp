import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  wordpressApi,
  type Post,
  type Category,
} from "../services/wordpressApi.ts";
import PostCard from "../components/PostCard.tsx";
import { Button } from "../components/ui";
import { Skeleton } from "../components/ui";
import { Badge } from "../components/ui";
import { Separator } from "../components/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui";

function CategoryPosts() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        // Fetch category details
        const categoryData = await wordpressApi.getCategoryBySlug(slug);
        setCategory(categoryData);

        // Fetch posts for this category
        const postsData = await wordpressApi.getPostsByCategorySlug(
          slug,
          postsPerPage,
          currentPage
        );
        setPosts(postsData);
        setHasMore(postsData.length === postsPerPage);
      } catch (error) {
        console.error("Error fetching category posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, currentPage]);

  const loadMorePosts = async () => {
    if (!slug) return;

    try {
      const nextPage = currentPage + 1;
      const morePosts = await wordpressApi.getPostsByCategorySlug(
        slug,
        postsPerPage,
        nextPage
      );

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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kategori Tidak Ditemukan
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Kategori yang Anda cari tidak dapat ditemukan.
        </p>
        <Button asChild>
          <Link to="/categories">← Kembali ke Kategori</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/categories">Kategori</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </nav>

      {/* Category Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {category.name}
          </Badge>
          <span className="text-gray-500 text-sm">
            {category.count} artikel
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <Separator className="mb-12" />

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
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

          {/* Posts Count */}
          <div className="text-center mt-8 text-gray-600">
            Menampilkan {posts.length} dari {category.count} artikel dalam
            kategori {category.name}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Belum ada artikel
          </h3>
          <p className="text-gray-600 mb-6">
            Kategori ini belum memiliki artikel. Silakan cek kembali nanti.
          </p>
          <Button variant="outline" asChild>
            <Link to="/categories">← Kembali ke Kategori</Link>
          </Button>
        </div>
      )}

      {/* Related Categories */}
      <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Kategori Lainnya
        </h2>
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/categories">Jelajahi Semua Kategori</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPosts;
