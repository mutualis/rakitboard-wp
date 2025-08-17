import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wordpressApi, type Post as PostType } from "../services/wordpressApi";

interface ArticleSidebarProps {
  currentSlug?: string;
  categoryId?: number;
}

export function ArticleSidebar({
  currentSlug,
  categoryId,
}: ArticleSidebarProps) {
  const [articles, setArticles] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let posts: PostType[];

        if (categoryId) {
          // Jika ada categoryId, ambil artikel berdasarkan kategori
          posts = await wordpressApi.getPostsByCategoryId(categoryId, 10);
        } else {
          // Jika tidak ada categoryId, ambil semua artikel terbaru
          posts = await wordpressApi.getPosts({ per_page: 10 });
        }

        setArticles(posts);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Fallback ke default articles jika API gagal
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

  // Default articles jika tidak ada data dari API
  const defaultArticles = [
    {
      id: "1",
      title: "Getting Started with FreeRTOS",
      slug: "getting-started-freertos",
    },
    {
      id: "2",
      title: "ESP32 Dual Core Programming",
      slug: "esp32-dual-core",
    },
    {
      id: "3",
      title: "FreeRTOS Task Management",
      slug: "freertos-task-management",
    },
    {
      id: "4",
      title: "WiFi and Sensor Integration",
      slug: "wifi-sensor-integration",
    },
    {
      id: "5",
      title: "Real-time Applications",
      slug: "real-time-applications",
    },
  ];

  const articleList = articles.length > 0 ? articles : defaultArticles;

  if (loading) {
    return (
      <div className="sticky top-24 space-y-4">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-background/95 backdrop-blur-sm py-2 z-10 border-b border-border">
          Articles
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-muted/30 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-4">
      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-background/95 backdrop-blur-sm py-2 z-10 border-b border-border">
        Articles
      </div>
      <nav className="space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {articleList.map((article) => {
          const isActive = article.slug === currentSlug;
          const title =
            typeof article.title === "string"
              ? article.title
              : article.title?.rendered || "Untitled";
          const slug =
            typeof article.slug === "string"
              ? article.slug
              : article.slug || "untitled";

          return (
            <Link
              key={article.id}
              to={`/post/${slug}`}
              className={`group flex items-start text-left w-full text-sm transition-all duration-300 ease-out hover:text-foreground relative py-2 px-3 rounded-md hover:bg-muted/50 ${
                isActive ? "bg-muted/80 border-l-3 border-l-primary pl-3" : ""
              }`}
            >
              <span className="text-sm leading-relaxed break-words">
                {title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
