'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEquipement } from '@/hooks/useEquipement';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import EquipementCard from '@/components/equipements/EquipementCard';
import ReservationModal from '@/components/resevations/reservationModal';
import { EquipementStatus, IEquipement } from '@repo/shared';

const STATUS_OPTIONS = [
    { value: '', label: 'Tous les états' },
    { value: EquipementStatus.DISPONIBLE, label: '🟢 Disponible' },
    { value: EquipementStatus.RESERVE, label: '🟠 Réservé' },
    { value: EquipementStatus.EN_MAINTENANCE, label: '🔵 Maintenance' },
    { value: EquipementStatus.HORS_SERVICE, label: '🔴 Hors service' },
];

export default function EquipementsPage() {
    const { equipements, loading, fetchAll, remove } = useEquipement();
    const { isAdmin } = useAuth();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    const [selected, setSelected] = useState<IEquipement | null>(null);

    useEffect(() => {
        fetchAll({
            search: search || undefined,
            status: status as EquipementStatus || undefined,
            page,
            limit: 12,
        });
    }, [search, status, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cet équipement ?')) return;
        await remove(id);
    };

    return (
        <div className="max-w-7xl space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        {isAdmin ? 'Gestion des équipements' : 'Catalogue'}
                    </h1>
                    <p className="text-textgray text-sm mt-1">
                        {equipements?.meta.total ?? 0} équipement(s) au total
                    </p>
                </div>
                {isAdmin && (
                    <Link
                        href="/equipements/new"
                        className="bg-primary hover:bg-primary/90 text-white font-bold
              px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                        Ajouter
                    </Link>
                )}
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Recherche */}
                <div className="relative flex-1">
                    <span
                        className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
                        style={{ fontSize: '20px' }}
                    >
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Rechercher un équipement..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl
              outline-none text-sm bg-white focus:border-primary
              focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                </div>

                {/* Filtre statut */}
                <select
                    value={status}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="py-2.5 px-4 border-2 border-gray-200 rounded-xl outline-none
            text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
            transition-all sm:w-52"
                >
                    {STATUS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Grille */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : !equipements?.data.length ? (
                <div className="flex flex-col items-center py-20 gap-3 text-textgray">
                    <span className="material-icons text-5xl text-gray-200">inventory_2</span>
                    <p className="font-medium">Aucun équipement trouvé</p>
                    {search && (
                        <button
                            onClick={() => setSearchInput('')}
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            Effacer la recherche
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {equipements.data.map(eq => (
                        <EquipementCard
                            key={eq._id}
                            equipement={eq}
                            variant="dashboard"
                            isAdmin={isAdmin}
                            onReserve={() => setSelected(eq)}
                            onDelete={() => handleDelete(eq._id)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {equipements && equipements.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
              justify-center text-textgray hover:border-primary hover:text-primary
              disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>chevron_left</span>
                    </button>

                    {Array.from({ length: equipements.meta.totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all
                                ${p === page
                                    ? 'bg-primary text-white'
                                    : 'border border-gray-200 text-textgray hover:border-primary hover:text-primary'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        disabled={page === equipements.meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
              justify-center text-textgray hover:border-primary hover:text-primary
              disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>chevron_right</span>
                    </button>
                </div>
            )}

            {/* Modal réservation */}
            {selected && (
                <ReservationModal
                    equipement={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}