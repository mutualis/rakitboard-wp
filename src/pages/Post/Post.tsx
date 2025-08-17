import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  wordpressApi,
  type Post as PostType,
} from "@/services/wordpressApi.ts";
import { Comments } from "./components";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Separator } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { ArticleContent, TableOfContents } from "./components";
import { ArticleSidebar } from "@/components/ArticleSidebar";

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const postData = await wordpressApi.getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Skeleton */}
        <nav className="mb-8">
          <Skeleton className="h-6 w-32" />
        </nav>

        {/* Post Header Skeleton */}
        <header className="mb-8">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
        </header>

        {/* Post Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Artikel yang Anda cari tidak dapat ditemukan.
        </p>
        <Button asChild>
          <Link to="/">← Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const categories = post._embedded?.["wp:term"]?.[0] || [];

  return (
    <div className="w-full">
      {/* Breadcrumb and Sidebar Layout */}
      <div className="flex gap-8">
        {/* Left Sidebar - Article List */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <ArticleSidebar
            currentSlug={slug}
            categoryId={categories.length > 0 ? categories[0].id : undefined}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            {categories.length > 0 && (
              <>
                <span>›</span>
                <Link
                  to={`/category/${categories[0].slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {categories[0].name}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-foreground font-medium truncate max-w-xs">
              {post.title.rendered}
            </span>
          </nav>

          <article>
            {/* Post Header */}
            <header className="mb-12">
              <div className="mb-6">
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Link key={category.id} to={`/category/${category.slug}`}>
                        <Badge
                          variant="secondary"
                          className="hover:bg-secondary/80"
                        >
                          {category.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title.rendered}
                </h1>

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar-placeholder.png" alt="Author" />
                      <AvatarFallback className="text-xs">RB</AvatarFallback>
                    </Avatar>
                    <span>RakitBoard Team</span>
                  </div>

                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>

              {featuredImage && (
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={featuredImage.source_url}
                    alt={featuredImage.alt_text || post.title.rendered}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  {featuredImage.alt_text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm">
                      {featuredImage.alt_text}
                    </div>
                  )}
                </div>
              )}
            </header>

            {/* Content and TOC Layout - 2 Columns */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Post Content - 2 kolom */}
              <ArticleContent content={post.content.rendered} />

              {/* Table of Contents - 1 kolom */}
              <div className="xl:col-span-1">
                <TableOfContents content={post.content.rendered} />
              </div>
            </div>
          </article>

          <Separator className="my-12 max-w-7xl mx-auto px-4 lg:px-8" />

          {/* Post Footer */}
          <footer className="mb-12 max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Bagikan artikel ini:
                </h3>
                <p className="text-sm text-gray-600">
                  Jika artikel ini bermanfaat, bagikan kepada teman-teman Anda
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  📱 Bagikan
                </Button>
                <Button variant="outline" size="sm">
                  📧 Email
                </Button>
              </div>
            </div>
          </footer>

          {/* Comments Section */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <Comments postId={post.id} />
          </div>

          {/* Navigation */}
          {categories.length > 0 && (
            <div className="mt-16 max-w-7xl mx-auto px-4 lg:px-8">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Ingin belajar lebih lanjut?
                    </h3>
                    <p className="text-gray-600">
                      Jelajahi artikel lain dalam kategori {categories[0].name}
                    </p>
                  </div>

                  <Button variant="outline" asChild>
                    <Link to={`/category/${categories[0].slug}`}>
                      Lihat Semua {categories[0].name}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
