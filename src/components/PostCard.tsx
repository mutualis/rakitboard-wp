import { Link } from "react-router-dom";
import type { Post } from "../services/wordpressApi.ts";
import { Card, CardContent, CardFooter, CardHeader } from "./ui";
import { Avatar, AvatarFallback, AvatarImage } from "./ui";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

function PostCard({ post, variant = "default" }: PostCardProps) {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];

  if (variant === "compact") {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="p-0">
          {featuredImage && (
            <Link to={`/post/${post.slug}`}>
              <img
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || post.title.rendered}
                className="w-full h-32 object-cover rounded-t-lg"
              />
            </Link>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            <Link to={`/post/${post.slug}`}>{post.title.rendered}</Link>
          </h3>

          <div
            className="text-muted-foreground text-sm line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>

            <Link
              to={`/post/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Baca »
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm">
      <CardHeader className="p-0">
        {featuredImage && (
          <Link to={`/post/${post.slug}`}>
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold leading-tight line-clamp-2">
          <Link to={`/post/${post.slug}`}>{post.title.rendered}</Link>
        </h2>

        <div
          className="text-muted-foreground text-sm line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
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

          <Link
            to={`/post/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Baca Selengkapnya »
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
