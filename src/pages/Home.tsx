import { useState, useEffect } from "react";
import {
  wordpressApi,
  type Post,
  type Category,
} from "../services/wordpressApi.ts";
import PostCard from "@/components/PostCard.tsx";
import Hero from "@/components/Hero.tsx";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui";

interface CategoryWithPosts extends Category {
  posts: Post[];
}

function Home() {
  const [categoriesWithPosts, setCategoriesWithPosts] = useState<
    CategoryWithPosts[]
  >([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get categories first
        const categoriesData = await wordpressApi.getCategories();
        const activeCategories = categoriesData
          .filter((cat) => cat.count > 0)
          .slice(0, 6); // Ambil 6 kategori teratas

        // Get featured posts (latest posts)
        const latestPosts = await wordpressApi.getPosts({ per_page: 6 });
        setFeaturedPosts(latestPosts);

        // Get posts for each category
        const categoryIds = activeCategories.map((cat) => cat.id);
        const postsByCategory = await wordpressApi.getPostsByCategories(
          categoryIds,
          4
        ); // 4 posts per kategori

        // Combine categories with their posts
        const categoriesWithPostsData: CategoryWithPosts[] =
          activeCategories.map((category) => ({
            ...category,
            posts: postsByCategory[category.id] || [],
          }));

        setCategoriesWithPosts(categoriesWithPostsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch posts for selected category
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (selectedCategory === "all") {
        setCategoryPosts([]);
        return;
      }

      try {
        const posts = await wordpressApi.getPostsByCategorySlug(
          selectedCategory,
          8
        );
        setCategoryPosts(posts);
      } catch (error) {
        console.error("Error fetching category posts:", error);
        setCategoryPosts([]);
      }
    };

    fetchCategoryPosts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-16">
        {/* Hero Section Skeleton */}
        <section className="text-center py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl">
          <Skeleton className="h-16 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-8 w-80 mx-auto bg-white/20" />
        </section>

        {/* Featured Posts Skeleton */}
        <section>
          <Skeleton className="h-10 w-48 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Hero
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Category Posts Section */}
      {selectedCategory !== "all" && categoryPosts.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Artikel{" "}
              {
                categoriesWithPosts.find((cat) => cat.slug === selectedCategory)
                  ?.name
              }
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tutorial dan artikel terbaru seputar{" "}
              {
                categoriesWithPosts.find((cat) => cat.slug === selectedCategory)
                  ?.name
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to={`/category/${selectedCategory}`}>
                Lihat Semua{" "}
                {
                  categoriesWithPosts.find(
                    (cat) => cat.slug === selectedCategory
                  )?.name
                }
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Artikel Terbaru
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan tutorial dan artikel terbaru seputar elektronik dan
            pemrograman
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/posts">Lihat Semua Artikel</Link>
          </Button>
        </div>
      </section>

      {/* Posts by Category */}
      {categoriesWithPosts.map((category) => (
        <section key={category.id} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h2>
              <p className="text-gray-600 mt-2">
                {category.count} artikel tersedia dalam kategori ini
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to={`/category/${category.slug}`}>
                Lihat Semua ({category.count})
              </Link>
            </Button>
          </div>

          {category.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.posts.map((post) => (
                <PostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                Belum ada artikel dalam kategori ini.
              </p>
            </div>
          )}
        </section>
      ))}

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Siap untuk mulai belajar?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Jelajahi semua kategori dan temukan tutorial yang sesuai dengan
          kebutuhan Anda
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/categories">Jelajahi Kategori</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/about">Tentang Kami</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
