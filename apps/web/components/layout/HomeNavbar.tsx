'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomeNavbar() {
    const { user, loading } = useAuth();

    return (
        <header
            className="sticky top-0 z-40 h-16 flex items-center justify-between
        px-6 shadow-sm"
            style={{ background: '#274c77' }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary" style={{ fontSize: '18px' }}>
                        inventory_2
                    </span>
                </div>
                <span className="text-white font-extrabold text-lg tracking-tight">
                    EquipFlow
                </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1">
                <Link
                    href="/"
                    className="px-4 py-2 rounded-lg text-white/70 hover:text-white
            hover:bg-white/10 text-sm font-medium transition-all"
                >
                    Catalogue
                </Link>
                {user && (
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg text-white/70 hover:text-white
              hover:bg-white/10 text-sm font-medium transition-all"
                    >
                        Mon espace
                    </Link>
                )}
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
                {!loading && !user ? (
                    <>
                        <Link
                            href="/login"
                            className="text-white/70 hover:text-white text-sm
                font-semibold transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/register"
                            className="bg-white text-primary font-bold px-4 py-2
                rounded-xl text-sm hover:bg-white/90 transition-all"
                        >
                            S&apos;inscrire
                        </Link>
                    </>
                ) : !loading && user ? (
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20
              text-white font-semibold px-4 py-2 rounded-xl text-sm
              transition-all"
                    >
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center
              justify-center text-primary font-bold text-xs">
                            {user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        Mon espace
                    </Link>
                ) : null}
            </div>
        </header>
    );
}