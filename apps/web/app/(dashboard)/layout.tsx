import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { EquipementProvider } from '@/context/EquipementContext';
import { ReservationProvider } from '@/context/ReservationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

console.log('DASHBOARD LAYOUT');
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
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
        </ProtectedRoute>
    );
}