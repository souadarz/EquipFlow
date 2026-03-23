'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  login as loginService,
  register as registerService,
  me as meService,
  logout as logoutService,
} from '@/services/auth.service';
import { IUser } from '@repo/shared';


interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    meService()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  //login
  const login = async (email: string, password: string) => {
    const data = await loginService({ email, password });
    if (data?.user) {
      setUser(data.user);
    }
  };

  //register
  const register = async (
    fullname: string,
    email: string,
    password: string,
  ) => {
    const data = await registerService({ fullname, email, password });
    if (data?.user) {
      setUser(data.user);
    }
  };

  //logout
  const logout = async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      router.replace('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}