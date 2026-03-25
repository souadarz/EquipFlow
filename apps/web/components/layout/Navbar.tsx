'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de votre activité' },
    '/equipements': { title: 'Équipements', subtitle: 'Catalogue et gestion du matériel' },
    '/reservations': { title: 'Réservations', subtitle: 'Suivi de vos demandes de réservation' },
    '/maintenance': { title: 'Maintenance', subtitle: 'Suivi des interventions sur le matériel' },
    '/categories': { title: 'Catégories', subtitle: 'Gestion des catégories d\'équipements' },
    '/users': { title: 'Utilisateurs', subtitle: 'Gestion des comptes utilisateurs' },
    '/settings': { title: 'Paramètres', subtitle: 'Configuration de la plateforme' },
};

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Trouve le titre en cherchant le match le plus précis
    const pageInfo = Object.entries(pageTitles)
        .sort(([a], [b]) => b.length - a.length)
        .find(([key]) => pathname.startsWith(key))?.[1]
        ?? { title: 'EquipFlow', subtitle: '' };

    return (
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-100
      flex items-center justify-between px-6">

            {/* Titre de la page courante */}
            <div>
                <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
                    {pageInfo.title}
                </h1>
                {pageInfo.subtitle && (
                    <p className="text-xs text-textgray mt-0.5">
                        {pageInfo.subtitle}
                    </p>
                )}
            </div>

            {/* Actions droite */}
            <div className="flex items-center gap-3">

                {/* Notifications */}
                <button
                    className="relative w-9 h-9 rounded-xl bg-bg flex items-center justify-center
            text-textgray hover:text-primary hover:bg-accent/30 transition-all"
                    title="Notifications"
                >
                    <span className="material-icons" style={{ fontSize: '20px' }}>
                        notifications_none
                    </span>
                    {/* Badge notifications */}
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"
                    />
                </button>

                {/* Séparateur */}
                <div className="h-6 w-px bg-gray-200" />

                {/* User info */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center
              text-primary font-bold text-xs flex-shrink-0"
                        style={{ background: '#a3cef1' }}
                    >
                        {user?.fullname?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) ?? '??'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {user?.fullname}
                        </p>
                        <p className="text-xs text-textgray">
                            {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}