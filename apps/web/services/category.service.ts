import api from '@/lib/axios';
import { ICategory, ICategoryPayload } from '@repo/shared';

export async function findAllCategories() {
  try {
    const response = await api.get<Promise<ICategory[]>>('/categories');
  
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

export async function createCategory(payload: ICategoryPayload) {
  try {
    const response = await api.post<ICategory>('/categories', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await api.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}