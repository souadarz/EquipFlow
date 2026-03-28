'use client';

import { useState, useEffect } from 'react';
import { useEquipement } from '@/hooks/useEquipement';
import { useMaintenance } from '@/hooks/useMaintenance';
import { IEquipement, EquipementStatus } from '@repo/shared';

export default function MaintenanceForm() {
    const { equipements, fetchAll: fetchEquipements } = useEquipement();
    const { create } = useMaintenance();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedEquip, setSelectedEquip] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEquipements();
    }, [fetchEquipements]);

    const availableEquipements = equipements?.data.filter(eq => eq.status === EquipementStatus.DISPONIBLE) ?? [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEquip || !startDate || !endDate) return;

        setSubmitting(true);
        try {
            await create({
                equipement: selectedEquip,
                startDate,
                description
            });
            // Reset form
            setStartDate('');
            setEndDate('');
            setSelectedEquip('');
            setDescription('');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="h-2 bg-[#1e3a5f]" />
            <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-icons" style={{ fontSize: '24px' }}>calendar_today</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Planifier une nouvelle<br />maintenance
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-textgray uppercase tracking-wider">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 
                                    text-sm focus:border-primary focus:bg-white outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-textgray uppercase tracking-wider">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 
                                    text-sm focus:border-primary focus:bg-white outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-textgray uppercase tracking-wider">
                            Sélection de l'équipement
                        </label>
                        <select
                            value={selectedEquip}
                            onChange={(e) => setSelectedEquip(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 
                                text-sm focus:border-primary focus:bg-white outline-none transition-all appearance-none"
                            required
                        >
                            <option value="">Choisir un équipement...</option>
                            {availableEquipements.map((eq: IEquipement) => (
                                <option key={eq._id} value={eq._id}>
                                    {eq.name} ({eq.serialNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-textgray uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez les exigences techniques..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 
                                text-sm focus:border-primary focus:bg-white outline-none transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-bold py-4 rounded-xl
                            shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]
                            flex items-center justify-center gap-2"
                    >
                        {submitting ? 'Planification...' : 'Générer le planning'}
                        {!submitting && <span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
