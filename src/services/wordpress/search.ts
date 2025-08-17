import { wpApi, type WPListParams } from './config';

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: 'post' | 'page';
  subtype: string;
}

export interface SearchParams extends WPListParams {
  search: string;
  subtype?: 'post' | 'page';
  type?: string;
}

export const searchService = {
  // Global search
  global: async (params: SearchParams): Promise<SearchResult[]> => {
    const response = await wpApi.get<SearchResult[]>('/search', {
      params,
    });
    return response.data;
  },

  // Search posts only
  posts: async (query: string, params?: Omit<SearchParams, 'search' | 'subtype'>): Promise<SearchResult[]> => {
    return searchService.global({ ...params, search: query, subtype: 'post' });
  },

  // Search pages only
  pages: async (query: string, params?: Omit<SearchParams, 'search' | 'subtype'>): Promise<SearchResult[]> => {
    return searchService.global({ ...params, search: query, subtype: 'page' });
  },
};