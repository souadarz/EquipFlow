'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useReservation } from '@/hooks/useReservation';
import { IEquipement } from '@repo/shared';

interface FormValues {
    startDate: string;
    endDate: string;
}

interface Props {
    equipement: IEquipement;
    onClose: () => void;
}

export default function ReservationModal({ equipement, onClose }: Props) {
    const { create } = useReservation();
    const overlayRef = useRef<HTMLDivElement>(null);

    const today = new Date().toISOString().split('T')[0];

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const startDate = watch('startDate');

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const onSubmit = async (values: FormValues) => {
        await create({
            equipement: equipement._id,
            startDate: values.startDate,
            endDate: values.endDate,
        });
        onClose();
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Nouvelle réservation</h2>
                        <p className="text-textgray text-sm mt-0.5">{equipement.name}</p>
                        <span className="font-mono text-xs text-textgray">SN : {equipement.serialNumber}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex
              items-center justify-center transition-colors"
                    >
                        <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                    {/* startDate */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Date de début <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            min={today}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none text-sm bg-white
                transition-all focus:border-primary focus:ring-2 focus:ring-primary/10
                ${errors.startDate ? 'border-red-300' : 'border-gray-200'}`}
                            {...register('startDate', { required: 'La date de début est requise' })}
                        />
                        {errors.startDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>
                        )}
                    </div>

                    {/* endDate */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Date de fin <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            min={startDate || today}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none text-sm bg-white
                transition-all focus:border-primary focus:ring-2 focus:ring-primary/10
                ${errors.endDate ? 'border-red-300' : 'border-gray-200'}`}
                            {...register('endDate', {
                                required: 'La date de fin est requise',
                                validate: v => !startDate || v > startDate
                                    || 'La date de fin doit être après la date de début',
                            })}
                        />
                        {errors.endDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="material-icons text-blue-500 mt-0.5" style={{ fontSize: '16px' }}>
                            info
                        </span>
                        <p className="text-xs text-blue-700">
                            La réservation sera confirmée par un administrateur sous 24h.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold
                                text-textgray text-sm hover:bg-gray-50 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60
                            disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl
                            text-sm shadow-lg shadow-primary/20 flex items-center justify-center
                            gap-2 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {isSubmitting ? 'Envoi...' : 'Confirmer la réservation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}