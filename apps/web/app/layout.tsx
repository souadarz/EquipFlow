// apps/web/src/app/layout.tsx
import type { Metadata } from 'next';
import { AuthProvider }  from '@/context/AuthContext';
import { Toaster }       from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'EquipFlow',
  description: 'Gestion et allocation des équipements',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <body className="bg-background-light dark:bg-background-dark min-h-screen font-display antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}