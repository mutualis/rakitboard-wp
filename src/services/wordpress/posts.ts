import { wpApi, type WPListParams } from "./config";

export interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  status: "publish" | "draft" | "future" | "private";
  categories: number[];
  tags: number[];
  featured_media: number;
  author: number;
  sticky: boolean;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls: Record<string, string>;
    }>;
  };
}

export interface PostListParams extends WPListParams {
  categories?: string;
  categories_exclude?: string;
  tags?: string;
  tags_exclude?: string;
  author?: string;
  author_exclude?: string;
  status?: "publish" | "draft" | "future" | "private";
  sticky?: boolean;
  slug?: string;
  offset?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  status?: "draft" | "publish";
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  excerpt?: string;
  slug?: string;
}

export const postsService = {
  // Get posts list
  list: async (params?: PostListParams): Promise<Post[]> => {
    const response = await wpApi.get<Post[]>("/posts", {
      params: {
        _embed: true,
        ...params,
      },
    });
    return response.data;
  },

  // Get post by slug
  getBySlug: async (slug: string): Promise<Post | null> => {
    const response = await wpApi.get<Post[]>("/posts", {
      params: {
        slug,
        _embed: true,
      },
    });
    return response.data[0] || null;
  },

  // Get post by ID
  getById: async (id: number): Promise<Post> => {
    const response = await wpApi.get<Post>(`/posts/${id}`, {
      params: { _embed: true },
    });
    return response.data;
  },

  // Create new post (requires auth)
  create: async (data: CreatePostData): Promise<Post> => {
    const response = await wpApi.post<Post>("/posts", data);
    return response.data;
  },

  // Update post (requires auth)
  update: async (id: number, data: Partial<CreatePostData>): Promise<Post> => {
    const response = await wpApi.post<Post>(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post (requires auth)
  delete: async (id: number, force: boolean = true): Promise<void> => {
    await wpApi.delete(`/posts/${id}`, {
      params: { force },
    });
  },

  // Search posts
  search: async (
    query: string,
    params?: Omit<PostListParams, "search">
  ): Promise<Post[]> => {
    return postsService.list({ ...params, search: query });
  },

  // Get posts by category ID with limit
  getByCategoryId: async (categoryId: number, limit: number = 5): Promise<Post[]> => {
    const response = await wpApi.get<Post[]>('/posts', {
      params: {
        categories: categoryId,
        per_page: limit,
        orderby: 'date',
        order: 'desc',
        _embed: true,
      },
    });
    return response.data;
  },

  // Get posts by category slug with limit
  getByCategorySlug: async (categorySlug: string, limit: number = 5): Promise<Post[]> => {
    // First get category ID by slug
    const categoryResponse = await wpApi.get<any[]>('/categories', {
      params: { slug: categorySlug },
    });
    
    if (categoryResponse.data.length === 0) {
      return [];
    }
    
    const categoryId = categoryResponse.data[0].id;
    return postsService.getByCategoryId(categoryId, limit);
  },

  // Get posts from multiple categories
  getPostsByCategories: async (categoryIds: number[], postsPerCategory: number = 5): Promise<{ [categoryId: number]: Post[] }> => {
    const results: { [categoryId: number]: Post[] } = {};
    
    // Fetch posts for each category in parallel
    const promises = categoryIds.map(async (categoryId) => {
      const posts = await postsService.getByCategoryId(categoryId, postsPerCategory);
      return { categoryId, posts };
    });
    
    const categoryPosts = await Promise.all(promises);
    
    categoryPosts.forEach(({ categoryId, posts }) => {
      results[categoryId] = posts;
    });
    
    return results;
  },
};
