import { api } from './client';
import type { BlogPost, BlogPostDetail } from '../types';

export const blogApi = {
  async list() {
    const { data } = await api.get<BlogPost[]>('/blog');
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<BlogPostDetail>(`/blog/${id}`);
    return data;
  },
};
