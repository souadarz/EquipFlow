'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useReservation } from '@/hooks/useReservation';
import Spinner from '@/components/ui/Spinner';
import StatCard from '@/components/ui/StatCard';
import ReservationStatusBadge from '@/components/ui/ReservationStatusBadge';
import { ReservationStatus } from '@repo/shared';
import { useEquipement } from '@/hooks/useEquipement';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { reservations, loading, fetchAll } = useReservation();
  const { equipements, loading: loadingEquip, fetchAll: fetchEquipements} = useEquipement()
  useEffect(() => {
    fetchAll({ limit: 5 });
    fetchEquipements();
  }, []);

  const totalEquipement = equipements?.meta.total ?? 0;

  const firstName = user?.fullname.split(' ')[0] ?? 'vous';

  // Stats calculées depuis les réservations
  const actives = reservations?.data.filter(r =>
    r.status === ReservationStatus.ACTIVE ||
    r.status === ReservationStatus.CONFIRME
  ).length ?? 0;

  const prochaine = reservations?.data
    .filter(r => r.status === ReservationStatus.CONFIRME)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const joursRestants = prochaine
    ? Math.ceil(
      (new Date(prochaine.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    : null;

  return (
    <div className="max-w-5xl space-y-6">

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Bonjour, {firstName}
        </h1>
        <p className="text-textgray mt-1 text-sm">
          Voici un résumé de votre activité.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Équipements disponibles"
          value={String(totalEquipement)}
          delta="↑ 3 ajoutés cette semaine"
          deltaType="success"
          icon="check_circle"
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Réservations en cours"
          value={loading ? '...' : String(actives)}
          delta="Actives actuellement"
          deltaType="info"
          icon="event_available"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Prochaine réservation"
          value={loading ? '...' : joursRestants !== null ? `${joursRestants}j` : '—'}
          delta={prochaine?.equipement?.name ?? 'Aucune prévue'}
          deltaType="warning"
          icon="schedule"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <div
        className="rounded-2xl p-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#274c77,#6096ba)' }}
      >
        <div>
          <h3 className="text-white font-bold text-lg mb-1">
            Besoin d&apos;un équipement ?
          </h3>
          <p className="text-white/70 text-sm">
            Parcourez le catalogue et réservez en quelques clics.
          </p>
        </div>
        <Link
          href="/equipements"
          className="bg-white text-primary font-bold px-6 py-3 rounded-xl
            hover:bg-white/90 transition-all whitespace-nowrap text-sm"
        >
          Nouvelle réservation
        </Link>
      </div>

      {/* Historique récent */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Historique récent</h3>
          <Link
            href="/reservations"
            className="text-secondary text-sm font-semibold hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !reservations?.data.length ? (
          <div className="flex flex-col items-center py-12 text-textgray gap-2">
            <span className="material-icons text-4xl text-gray-200">event_busy</span>
            <p className="text-sm">Aucune réservation pour le moment</p>
            <Link href="/equipements" className="text-primary text-sm font-semibold hover:underline">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reservations.data.map(reservation => (
              <div
                key={reservation._id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-secondary" style={{ fontSize: '20px' }}>
                    inventory_2
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {reservation.equipement?.name ?? '—'}
                  </p>
                  <p className="text-textgray text-xs mt-0.5">
                    {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
                    {' → '}
                    {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <ReservationStatusBadge status={reservation.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}