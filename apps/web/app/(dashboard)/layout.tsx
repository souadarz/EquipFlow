'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Spinner from '@/components/ui/Spinner';
import { EquipementProvider } from '@/context/EquipementContext';
import { ReservationProvider } from '@/context/ReservationContext';

console.log('DASHBOARD LAYOUT');
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg">
                <Spinner />
            </div>
        );

    }

    if (!user) return null;

    return (
        <EquipementProvider>
            <ReservationProvider>
                <div className="flex h-screen overflow-hidden bg-bg">
                    <Sidebar />
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-y-auto p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </ReservationProvider>
        </EquipementProvider>
    );
}