import api from "@/lib/axios";
import { ILoginPayload, IRegisterPayload, IUser } from '@repo/shared'

// login
export async function login(payload: ILoginPayload) {
  const response = await api.post<{ user: IUser }>('/auth/login', payload);
  return response.data;
}

// register
export async function register(payload: IRegisterPayload) {
  const response = await api.post<{ user: IUser }>('/auth/register', payload);
  return response.data;
}

// me
export async function me() {
  const response = await api.get<IUser>('/auth/me');
  return response.data;
}

// logout
export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}