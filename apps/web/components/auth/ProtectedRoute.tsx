'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean; //true si la route est reserve aux admin
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (requireAdmin && !isAdmin) {
                router.push('/');
            }
        }
    }, [user, loading, isAdmin, requireAdmin, router]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user || (requireAdmin && !isAdmin)) {
        return null;
    }

    return <>{children}</>;
}
