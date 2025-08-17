import { wpApi, guestApi, type WPListParams } from './config';

export interface Comment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_email: string;
  author_url: string;
  date: string;
  content: { rendered: string };
  status: 'approve' | 'hold' | 'spam';
  type: string;
  author_avatar_urls: Record<string, string>;
  // Tambahan untuk nested replies
  children?: Comment[];
  depth?: number;
}

export interface CommentListParams extends WPListParams {
  post?: number;
  parent?: number;
  author?: number;
  author_email?: string;
  status?: 'approve' | 'hold' | 'spam';
}

export interface CreateCommentData {
  post: number;
  content: string;
  author_name?: string;
  author_email?: string;
  author_url?: string;
  parent?: number; // Sudah ada, tapi pastikan digunakan untuk replies
}

// Helper function untuk mengorganisir comments menjadi nested structure
const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // Inisialisasi semua comments dengan children array kosong
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, children: [], depth: 0 });
  });

  // Organisir ke dalam struktur nested
  comments.forEach(comment => {
    const commentWithChildren = commentMap.get(comment.id)!;
    
    if (comment.parent === 0) {
      // Root comment
      rootComments.push(commentWithChildren);
    } else {
      // Reply comment
      const parentComment = commentMap.get(comment.parent);
      if (parentComment) {
        commentWithChildren.depth = (parentComment.depth || 0) + 1;
        parentComment.children!.push(commentWithChildren);
      } else {
        // Jika parent tidak ditemukan, jadikan root comment
        rootComments.push(commentWithChildren);
      }
    }
  });

  return rootComments;
};

export const commentsService = {
  // Get comments list (using guest API)
  list: async (params?: CommentListParams): Promise<Comment[]> => {
    const response = await guestApi.get<Comment[]>('/comments', {
      params,
    });
    return response.data;
  },

  // Get comments by post ID dengan nested structure
  getByPost: async (postId: number, params?: Omit<CommentListParams, 'post'>): Promise<Comment[]> => {
    const comments = await commentsService.list({ ...params, post: postId });
    return organizeComments(comments);
  },

  // Create comment (guest) - using guest API
  createGuest: async (data: CreateCommentData): Promise<Comment> => {
    const payload = {
      post: Number(data.post),
      content: data.content.trim(),
      author_name: data.author_name?.trim() || '',
      author_email: data.author_email?.trim() || '',
      author_url: data.author_url?.trim() || '',
      parent: Number(data.parent || 0),
    };
    
    console.log('Sending comment payload:', payload);
    
    const response = await guestApi.post<Comment>('/comments', payload);
    return response.data;
  },

  // Create comment (authenticated) - using authenticated API
  createAuth: async (data: Omit<CreateCommentData, 'author_name' | 'author_email'>): Promise<Comment> => {
    const payload = {
      post: Number(data.post),
      content: data.content.trim(),
      parent: Number(data.parent || 0),
    };
    
    const response = await wpApi.post<Comment>('/comments', payload);
    return response.data;
  },

  // Update comment status (requires auth)
  updateStatus: async (id: number, status: 'approve' | 'hold' | 'spam'): Promise<Comment> => {
    const response = await wpApi.post<Comment>(`/comments/${id}`, { status });
    return response.data;
  },

  // Delete comment (requires auth)
  delete: async (id: number, force: boolean = true): Promise<void> => {
    await wpApi.delete(`/comments/${id}`, {
      params: { force },
    });
  },
};