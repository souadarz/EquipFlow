'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import ReservationStatusBadge from '@/components/ui/ReservationStatusBadge';
import { ReservationStatus, IReservation } from '@repo/shared';
import { useReservation } from '@/hooks/useReservation';

export default function ReservationsPage() {
    const { user, isAdmin } = useAuth();
    const { reservations, loading, fetchAll, updateStatus } = useReservation();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (!user) return;

        const query: any = {
            page,
            limit: 10,
        };

        if (!isAdmin && user.id) {
            query.user = user.id;
        }

        if (statusFilter) {
            query.status = statusFilter;
        }

        fetchAll(query);
    }, [user, isAdmin, page, statusFilter, fetchAll]);

    const handleUpdateStatus = async (id: string, newStatus: ReservationStatus) => {
        if (!confirm('Voulez-vous changer le statut de cette réservation ?')) return;
        try {
            await updateStatus(id, newStatus);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:ml-64 p-6 lg:p-10 w-full" style={{ paddingLeft: 'var(--sidebar-width, 0px)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        {isAdmin ? 'Gestion des réservations' : 'Mes réservations'}
                    </h1>
                    <p className="text-textgray text-sm mt-1">
                        {reservations?.meta.total ?? 0} réservation(s) trouvée(s)
                    </p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="py-2.5 px-4 border-2 border-gray-200 rounded-xl outline-none
                        text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                    <option value="">Tous les statuts</option>
                    <option value={ReservationStatus.ACTIVE}>Active</option>
                    <option value={ReservationStatus.CONFIRME}>Confirmée</option>
                    <option value={ReservationStatus.ANNULE}>Annulée</option>
                    <option value={ReservationStatus.COMPLETE}>Complète</option>
                </select>
            </div>

            {/* Table des réservations */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : !reservations?.data || reservations.data.length === 0 ? (
                <div className="flex flex-col items-center py-20 gap-3 text-textgray bg-white rounded-2xl border border-gray-100">
                    <span className="material-icons text-5xl text-gray-200">event_busy</span>
                    <p className="font-medium">Aucune réservation trouvée</p>
                    {statusFilter && (
                        <button
                            onClick={() => { setStatusFilter(''); setPage(1); }}
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            Enlever le filtre
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-textgray uppercase tracking-wider">Équipement</th>
                                    {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-textgray uppercase tracking-wider">Utilisateur</th>}
                                    <th className="px-6 py-4 text-xs font-semibold text-textgray uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-textgray uppercase tracking-wider">Statut</th>
                                    {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-textgray uppercase tracking-wider text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.data.map((res: IReservation) => (
                                    <tr key={res._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 text-sm">
                                                {res.equipement?.name || 'Inconnu'}
                                            </div>
                                            <div className="text-xs text-textgray font-mono mt-0.5">
                                                SN: {res.equipement?.serialNumber || 'N/A'}
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {res.user?.fullname || 'Inconnu'}
                                                </div>
                                                <div className="text-xs text-textgray mt-0.5">
                                                    {res.user?.email || 'N/A'}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                Du {new Date(res.startDate).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-xs text-textgray mt-0.5">
                                                Au {new Date(res.endDate).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ReservationStatusBadge status={res.status} />
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {res.status === ReservationStatus.ACTIVE && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(res._id, ReservationStatus.CONFIRME)}
                                                            className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                                                        >
                                                            Confirmer
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(res._id, ReservationStatus.ANNULE)}
                                                            className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                                        >
                                                            Rejeter
                                                        </button>
                                                    </>
                                                )}
                                                {res.status === ReservationStatus.CONFIRME && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(res._id, ReservationStatus.COMPLETE)}
                                                        className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        Marquer comme Complet
                                                    </button>
                                                )}
                                                {(res.status === ReservationStatus.ANNULE || res.status === ReservationStatus.COMPLETE) && (
                                                    <span className="text-xs text-textgray italic">Aucune action</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {reservations && reservations.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-textgray hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>chevron_left</span>
                    </button>

                    {Array.from({ length: reservations.meta.totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-textgray hover:border-primary hover:text-primary'}`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        disabled={page === reservations.meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-textgray hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}
