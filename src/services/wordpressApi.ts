import { categoriesService } from "./wordpress/categories";
import { postsService } from "./wordpress/posts";
import { commentsService } from "./wordpress/comments";

// Re-export all services
export { wpApi, WP_BASE_URL } from "./wordpress/config";
export {
  postsService,
  type Post,
  type PostListParams,
  type CreatePostData,
} from "./wordpress/posts";
export {
  categoriesService,
  type Category,
  type CategoryWithChildren,
  type CategoryListParams,
} from "./wordpress/categories";
export {
  mediaService,
  type Media,
  type MediaListParams,
} from "./wordpress/media";
export {
  commentsService,
  type Comment,
  type CommentListParams,
  type CreateCommentData,
} from "./wordpress/comments";
export {
  authService,
  type LoginCredentials,
  type JWTResponse,
  type User,
} from "./wordpress/auth";
export {
  searchService,
  type SearchResult,
  type SearchParams,
} from "./wordpress/search";

// Legacy compatibility - keep existing interface
export const wordpressApi = {
  // Test connection
  testConnection: async () => {
    try {
      console.log("WordPress API connection successful");
      return true;
    } catch (error) {
      console.error("WordPress API connection failed:", error);
      return false;
    }
  },

  // Legacy methods for backward compatibility
  getPosts: postsService.list,
  getPostBySlug: postsService.getBySlug,
  getCategories: categoriesService.list,
  getCategoriesParentOnly: categoriesService.getParentsOnly,
  getCategoriesWithChildren: categoriesService.getWithChildren,
  getAllCategories: categoriesService.list,
  getCategoryBySlug: categoriesService.getBySlug,
  
  // Comments methods
  getComments: commentsService.list,
  getCommentsByPost: commentsService.getByPost,
  createComment: commentsService.createGuest,
  
  // New methods for category-based posts
  getPostsByCategoryId: postsService.getByCategoryId,
  getPostsByCategorySlug: postsService.getByCategorySlug,
  getPostsByCategories: postsService.getPostsByCategories,
};
