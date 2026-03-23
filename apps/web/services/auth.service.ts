import api from "@/lib/axios";
import { ILoginPayload, IRegisterPayload, IUser } from '@repo/shared'

// login
export async function login(payload: ILoginPayload) {
  try {
    const response = await api.post<{ user: IUser }>('/auth/login', payload);
    return response.data;
  } catch (error) {
    console.error('Error login:', error);
    return null;
  }
}

// register
export async function register(payload: IRegisterPayload) {
  try {
    const response = await api.post<{ user: IUser }>('/auth/register', payload);
    return response.data;
  } catch (error) {
    console.error('Error register:', error);
    return null;
  }
}

// me
export async function me() {
  try {
    const response = await api.get<IUser>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// logout
export async function logout() {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error logout:', error);
    return null;
  }
}