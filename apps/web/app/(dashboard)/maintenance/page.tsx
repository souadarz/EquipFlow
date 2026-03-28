'use client';

import { useEffect } from 'react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useEquipement } from '@/hooks/useEquipement';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceItem from '@/components/maintenance/MaintenanceItem';
import Spinner from '@/components/ui/Spinner';
import { EquipementStatus } from '@repo/shared';

export default function MaintenancePage() {
    const { maintenances, loading, fetchAll } = useMaintenance();
    const { equipements, fetchAll: fetchEquipements } = useEquipement();

    useEffect(() => {
        fetchAll();
        fetchEquipements();
    }, [fetchAll, fetchEquipements]);

    const activeUnits = equipements?.data.filter(e => e.status !== EquipementStatus.HORS_SERVICE).length ?? 0;
    const currentMaintenances = maintenances?.filter(m => !m.endDate) ?? [];

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 w-full animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-[#112233] tracking-tight">
                        Gestion de la Maintenance
                    </h1>
                    <p className="text-textgray text-sm font-medium opacity-70 max-w-2xl">
                        Coordonnez les réparations des installations et le cycle de vie des équipements industriels.
                    </p>
                </div>

                {/* Stats card */}
                <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4 min-w-[180px]">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1e3a5f]">
                        <span className="material-icons" style={{ fontSize: '20px' }}>engineering</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-textgray uppercase tracking-widest leading-none mb-1">Équipe Active</p>
                        <p className="text-xl font-black text-[#1e3a5f] leading-none">{activeUnits} Unités</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Planification */}
                <div className="lg:col-span-4">
                    <MaintenanceForm />
                </div>

                {/* Right Panel: Maintenances en cours */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black text-[#1e3a5f] uppercase tracking-[0.2em]">
                            Maintenances en cours
                        </h2>
                        <div className="flex items-center gap-2">
                            <button className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm text-textgray hover:text-primary transition-all">
                                <span className="material-icons" style={{ fontSize: '20px' }}>grid_view</span>
                            </button>
                            <button className="p-2 bg-[#1e3a5f] rounded-lg shadow-sm text-white transition-all">
                                <span className="material-icons" style={{ fontSize: '20px' }}>format_list_bulleted</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Spinner size="lg" />
                        </div>
                    ) : currentMaintenances.length === 0 ? (
                        <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-200">
                                <span className="material-icons" style={{ fontSize: '32px' }}>build_circle</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Aucune maintenance en cours</h3>
                                <p className="text-sm text-textgray max-w-sm mx-auto mt-1">
                                    Tous vos équipements sont opérationnels ou en attente de planification.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {currentMaintenances.map(m => (
                                <MaintenanceItem key={m._id} maintenance={m} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
