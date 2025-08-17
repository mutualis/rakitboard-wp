import { wpApi, type WPListParams } from './config';

export interface Media {
  id: number;
  title: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: 'image' | 'file';
  mime_type: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    }>;
  };
}

export interface MediaListParams extends WPListParams {
  media_type?: 'image' | 'file';
  mime_type?: string;
}

export const mediaService = {
  // Get media list
  list: async (params?: MediaListParams): Promise<Media[]> => {
    const response = await wpApi.get<Media[]>('/media', {
      params,
    });
    return response.data;
  },

  // Get media by ID
  getById: async (id: number): Promise<Media> => {
    const response = await wpApi.get<Media>(`/media/${id}`);
    return response.data;
  },

  // Upload media (requires auth)
  upload: async (file: File, title?: string, alt_text?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (alt_text) formData.append('alt_text', alt_text);

    const response = await wpApi.post<Media>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete media (requires auth)
  delete: async (id: number, force: boolean = true): Promise<void> => {
    await wpApi.delete(`/media/${id}`, {
      params: { force },
    });
  },
};