'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { findAllEquipements } from '@/services/equipement.service';
import { findAllCategories } from '@/services/category.service';
import ReservationModal from '@/components/resevations/reservationModal';
import { EquipementStatus } from '@repo/shared';
import type { IEquipement, ICategory } from '@repo/shared';
import EquipementCard from '@/components/equipements/EquipementCard';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/layout/Hero';

export default function HomePage() {
    const { user } = useAuth();
    const [equipements, setEquipements] = useState<IEquipement[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState<IEquipement | null>(null);

    const LIMIT = 12;

    const load = useCallback(async () => {
        setLoading(true);
        const data = await findAllEquipements({
            search: search || undefined,
            status: statusFilter as EquipementStatus || undefined,
            category: categoryFilter || undefined,
            page,
            limit: LIMIT,
        });
        if (data) {
            setEquipements(data.data);
            setTotalPages(data.meta.totalPages);
        }
        setLoading(false);
    }, [search, statusFilter, categoryFilter, page]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        findAllCategories().then(data => {
            if (data) setCategories(data.data);
        });
    }, []);

    const handleReserve = (eq: IEquipement) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setSelected(eq);
    };

    return (
        <>
            <Hero
                title={<>Réservez le matériel<br /><span style={{ color: '#a3cef1' }}>dont vous avez besoin</span></>}
                subtitle="Chantiers, événements, formations — accédez au catalogue et réservez en quelques clics."
            >
                {/* Stats */}
                <div className="flex justify-center gap-12 text-white/60">
                    <div className="text-center">
                        <div className="text-3xl font-extrabold text-white">500+</div>
                        <div className="text-sm mt-1">Équipes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-extrabold text-white">12k+</div>
                        <div className="text-sm mt-1">Réservations</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-extrabold text-white">99%</div>
                        <div className="text-sm mt-1">Satisfaction</div>
                    </div>
                </div>
            </Hero>

            {/* Catalogue */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                {/* ... filtres ... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {equipements.map(eq => (
                        <EquipementCard
                            key={eq._id}
                            equipement={eq}
                            variant="public"
                            onReserve={() => handleReserve(eq)}
                        />
                    ))}
                </div>
            </section>

            <Footer />

            {selected && (
                <ReservationModal equipement={selected} onClose={() => setSelected(null)} />
            )}
        </>
    )
};