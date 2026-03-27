'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
// import { Role } from '@repo/shared';

const userLinks = [
    { href: '/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
    { href: '/equipements', icon: 'inventory_2', label: 'Catalogue' },
    { href: '/reservations', icon: 'event', label: 'Mes réservations' },
];

const adminLinks = [
    { href: '/dashboard', icon: 'dashboard', label: 'Vue d\'ensemble' },
    { href: '/equipements', icon: 'inventory_2', label: 'Équipements' },
    { href: '/reservations', icon: 'event', label: 'Réservations' },
    { href: '/maintenance', icon: 'build', label: 'Maintenance' },
    { href: '/categories', icon: 'category', label: 'Catégories' },
];

function SidebarLink({
    href,
    icon,
    label,
    active,
}: {
    href: string;
    icon: string;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150
        ${active
                    ? 'bg-primary text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
        >
            <span
                className="material-icons flex-shrink-0"
                style={{
                    fontSize: '20px',
                    color: active ? '#a3cef1' : 'inherit',
                }}
            >
                {icon}
            </span>
            {label}
        </Link>
    );
}

export default function Sidebar() {
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();

    const links = isAdmin ? adminLinks : userLinks;

    // Initiales de l'utilisateur
    const initials = user?.fullname?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? '??';

    return (
        <aside
            className="flex flex-col w-60 flex-shrink-0 p-4"
            style={{ background: '#1e3a5f', minHeight: '100vh' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary" style={{ fontSize: '18px' }}>
                        inventory_2
                    </span>
                </div>
                <span className="text-white font-extrabold text-lg tracking-tight">
                    EquipFlow
                </span>
            </div>

            {/* Rôle label */}
            <div className="px-3 mb-3">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                    {isAdmin ? 'Administration' : 'Mon espace'}
                </p>
            </div>

            {/* Liens */}
            <nav className="flex flex-col gap-1">
                {links.map(link => (
                    <SidebarLink
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        label={link.label}
                        active={
                            link.href === '/dashboard'
                                ? pathname === '/dashboard'
                                : pathname.startsWith(link.href)
                        }
                    />
                ))}
            </nav>

            {/* Séparateur admin */}
            {isAdmin && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="px-3 text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                        Paramètres
                    </p>
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all text-white/60 hover:bg-white/10 hover:text-white`}
                    >
                        <span className="material-icons" style={{ fontSize: '20px' }}>settings</span>
                        Paramètres
                    </Link>
                </div>
            )}

            {/* User footer */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all">
                    {/* Avatar */}
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center
              text-primary font-bold text-sm flex-shrink-0"
                        style={{ background: '#a3cef1' }}
                    >
                        {initials}
                    </div>

                    {/* Infos user */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                            {user?.fullname}
                        </p>
                        <p className="text-white/40 text-xs truncate">
                            {isAdmin ? 'Administrateur' : 'Utilisateur'}
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        title="Se déconnecter"
                        className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>
                            logout
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
}