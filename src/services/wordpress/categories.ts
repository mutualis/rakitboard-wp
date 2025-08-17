import { wpApi, type WPListParams } from './config';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  link: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface CategoryWithChildren extends Category {
  children?: Category[];
}

export interface CategoryListParams extends WPListParams {
  parent?: number;
  hide_empty?: boolean;
  slug?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  parent?: number;
  slug?: string;
}

export const categoriesService = {
  // Get all categories
  list: async (params?: CategoryListParams): Promise<Category[]> => {
    const response = await wpApi.get<Category[]>('/categories', {
      params: {
        per_page: 100,
        hide_empty: false,
        ...params,
      },
    });
    return response.data;
  },

  // Get parent categories only
  getParentsOnly: async (): Promise<Category[]> => {
    return categoriesService.list({ parent: 0 });
  },

  // Get categories with children (hierarchical)
  getWithChildren: async (): Promise<CategoryWithChildren[]> => {
    const allCategories = await categoriesService.list();
    const parentCategories = allCategories.filter(cat => cat.parent === 0);
    const childCategories = allCategories.filter(cat => cat.parent !== 0);
    
    return parentCategories.map(parent => ({
      ...parent,
      children: childCategories.filter(child => child.parent === parent.id)
    }));
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category | null> => {
    const response = await wpApi.get<Category[]>('/categories', {
      params: { slug },
    });
    return response.data[0] || null;
  },

  // Get category by ID
  getById: async (id: number): Promise<Category> => {
    const response = await wpApi.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Create category (requires auth)
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await wpApi.post<Category>('/categories', data);
    return response.data;
  },

  // Update category (requires auth)
  update: async (id: number, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await wpApi.post<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (requires auth)
  delete: async (id: number, force: boolean = true): Promise<void> => {
    await wpApi.delete(`/categories/${id}`, {
      params: { force },
    });
  },

  // Filter out uncategorized
  filterUncategorized: (categories: Category[]): Category[] => {
    return categories.filter(cat => cat.slug !== 'uncategorized');
  },
};