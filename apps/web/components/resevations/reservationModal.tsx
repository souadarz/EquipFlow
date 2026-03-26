'use client';

import { useEffect, useRef, useState } from 'react';
import { useReservation } from '@/hooks/useReservation';
import { IEquipement, ReservationStatus } from '@repo/shared';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { findAllReservations } from '@/services/reservation.service';

interface Props {
  equipement: IEquipement;
  onClose: () => void;
}

export default function ReservationModal({ equipement, onClose }: Props) {
  const { create } = useReservation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<{ start: Date; end: Date }[]>([]);

  // Fermeture au clavier
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Charger les réservations existantes pour bloquer les dates occupées
  useEffect(() => {
    findAllReservations({ equipement: equipement._id, limit: 200 }).then(data => {
      if (data?.data) {
        const ranges = data.data
          .filter(r => r.status !== ReservationStatus.ANNULE && r.status !== ReservationStatus.COMPLETE)
          .map(r => ({ start: new Date(r.startDate), end: new Date(r.endDate) }));
        setBookedRanges(ranges);
      }
    });
  }, [equipement._id]);

  const nights = startDate && endDate
    ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError('Veuillez sélectionner une date de début et une date de fin.');
      return;
    }

    setSubmitting(true);
    try {
      await create({
        equipement: equipement._id,
        startDate,
        endDate,
      });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.50)' }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Nouvelle réservation</h2>
            <p className="text-textgray text-sm mt-0.5 font-medium">{equipement.name}</p>
            <span className="font-mono text-xs text-textgray">SN : {equipement.serialNumber}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">

          {/* Calendrier sélecteur de dates */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            bookedRanges={bookedRanges}
            onChange={({ startDate: s, endDate: e }) => {
              setStartDate(s);
              setEndDate(e);
              setError(null);
            }}
          />

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <span className="material-icons" style={{ fontSize: '16px' }}>error_outline</span>
              {error}
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="material-icons text-blue-500 mt-0.5" style={{ fontSize: '16px' }}>info</span>
            <p className="text-xs text-blue-700">
              La réservation sera confirmée par un administrateur sous 24h.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-textgray text-sm hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !startDate || !endDate}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-primary/20
                flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {submitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {submitting
                ? 'Envoi...'
                : nights
                  ? `Réserver (${nights} j.)`
                  : 'Confirmer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}