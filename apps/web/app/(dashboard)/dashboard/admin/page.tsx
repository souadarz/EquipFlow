'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useEquipement } from '@/hooks/useEquipement';
import StatCard from '@/components/ui/StatCard';
import { EquipementStatus } from '@repo/shared';

export default function AdminDashboardPage() {
    const { equipements, loading: eqLoading, fetchAll: fetchEq } = useEquipement();

    useEffect(() => {
        fetchEq();
    }, []);

    const loading = eqLoading;

    // Stats calculées
    const totalEquip = equipements?.meta.total ?? 0;
    const disponibles = equipements?.data.filter(e => e.status === EquipementStatus.DISPONIBLE).length ?? 0;
    const enMaintenance = equipements?.data.filter(e => e.status === EquipementStatus.EN_MAINTENANCE).length ?? 0;
    const horsService = equipements?.data.filter(e => e.status === EquipementStatus.HORS_SERVICE).length ?? 0;

    return (
        <div className="max-w-6xl space-y-6">

            {/* Heading */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Vue d'ensemble</h1>
                    <p className="text-textgray mt-1 text-sm">Tableau de bord administrateur.</p>
                </div>
                <Link
                    href="/equipements/new"
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5
            rounded-xl flex items-center gap-2 text-sm transition-all"
                >
                    <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                    Ajouter équipement
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    label="Total équipements"
                    value={loading ? '...' : String(totalEquip)}
                    delta="↑ +5 ce mois"
                    deltaType="success"
                    icon="inventory_2"
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                />
                <StatCard
                    label="En maintenance"
                    value={loading ? '...' : String(enMaintenance)}
                    delta={`${disponibles} disponibles`}
                    deltaType="warning"
                    icon="build"
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    label="Hors service"
                    value={loading ? '...' : String(horsService)}
                    delta="Attention requise"
                    deltaType="danger"
                    icon="warning"
                    iconBg="bg-red-50"
                    iconColor="text-red-500"
                />
            </div>

            {/* Aperçu équipements par statut */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Répartition des équipements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Disponibles', count: disponibles, color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
                        { label: 'Réservés', count: equipements?.data.filter(e => e.status === EquipementStatus.RESERVE).length ?? 0, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
                        { label: 'Maintenance', count: enMaintenance, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
                        { label: 'Hors service', count: horsService, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
                    ].map(item => (
                        <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
                            <div className={`text-2xl font-extrabold ${item.text} mb-1`}>
                                {eqLoading ? '...' : item.count}
                            </div>
                            <div className={`text-xs font-semibold ${item.text}`}>{item.label}</div>
                            {/* Barre de progression */}
                            <div className="mt-2 h-1 bg-white/60 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.color} rounded-full transition-all`}
                                    style={{ width: totalEquip ? `${(item.count / totalEquip) * 100}%` : '0%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}