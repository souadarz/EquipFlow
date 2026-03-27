'use client';

import { useEffect }          from 'react';
import Link                   from 'next/link';
import { useEquipement }      from '@/hooks/useEquipement';
import { useReservation }     from '@/hooks/useReservation';
import { useMaintenance }     from '@/hooks/useMaintenance';
import Spinner                from '@/components/ui/Spinner';
import StatCard                from '@/components/ui/StatCard';
import ReservationStatusBadge  from '@/components/ui/ReservationStatusBadge';
import { EquipementStatus }   from '@repo/shared';

export default function AdminDashboardPage() {
  const { equipements,  loading: eqLoading,  fetchAll: fetchEq }   = useEquipement();
  const { reservations, loading: resLoading, fetchAll: fetchRes }   = useReservation();
  const { maintenances, loading: maintLoading, fetchAll: fetchMaint } = useMaintenance();

  useEffect(() => {
    fetchEq();
    fetchRes({ limit: 5 });
    fetchMaint();
  }, []);

  const loading = eqLoading || resLoading || maintLoading;

  // Stats calculées
  const totalEquip       = equipements?.meta.total ?? 0;
  const disponibles      = equipements?.data.filter(e => e.status === EquipementStatus.DISPONIBLE).length ?? 0;
  const enMaintenance    = equipements?.data.filter(e => e.status === EquipementStatus.EN_MAINTENANCE).length ?? 0;
  const horsService      = equipements?.data.filter(e => e.status === EquipementStatus.HORS_SERVICE).length ?? 0;
  const totalReservations = reservations?.meta.total ?? 0;

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
          label="Réservations actives"
          value={loading ? '...' : String(totalReservations)}
          delta="↑ +8 cette semaine"
          deltaType="success"
          icon="event_available"
          iconBg="bg-green-50"
          iconColor="text-green-600"
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

      {/* Alertes + Réservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Alertes maintenance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-icons text-amber-500" style={{ fontSize: '20px' }}>
              notifications_active
            </span>
            Alertes maintenance
          </h3>

          {maintLoading ? (
            <div className="flex justify-center py-6"><Spinner size="sm" /></div>
          ) : !maintenances?.length ? (
            <div className="text-center py-6 text-textgray text-sm">
              <span className="material-icons text-3xl text-gray-200 block mb-2">check_circle</span>
              Aucune alerte active
            </div>
          ) : (
            <div className="space-y-3">
              {maintenances.map(m => (
                <div
                  key={m._id}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100"
                >
                  <span className="material-icons text-amber-500 mt-0.5" style={{ fontSize: '16px' }}>
                    warning
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {m.equipement?.name ?? '—'}
                    </p>
                    <p className="text-xs text-textgray mt-0.5">
                      Depuis le {new Date(m.startDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/maintenance"
            className="flex items-center justify-center gap-1 mt-4 text-secondary
              text-sm font-semibold hover:underline"
          >
            Voir tout
            <span className="material-icons" style={{ fontSize: '16px' }}>chevron_right</span>
          </Link>
        </div>

        {/* Réservations récentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Réservations récentes</h3>
            <Link
              href="/reservations"
              className="text-secondary text-sm font-semibold hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {resLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : !reservations?.data.length ? (
            <div className="flex flex-col items-center py-12 text-textgray gap-2">
              <span className="material-icons text-4xl text-gray-200">event_busy</span>
              <p className="text-sm">Aucune réservation</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reservations.data.map(r => (
                <div
                  key={r._id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {r.equipement?.name ?? '—'}
                    </p>
                    <p className="text-xs text-textgray mt-0.5">{r.user?.fullname ?? '—'}</p>
                  </div>
                  <p className="text-xs text-textgray whitespace-nowrap hidden sm:block">
                    {new Date(r.startDate).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                    {' → '}
                    {new Date(r.endDate).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                  </p>
                  <ReservationStatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aperçu équipements par statut */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Répartition des équipements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Disponibles',   count: disponibles,   color: 'bg-green-500', bg: 'bg-green-50',  text: 'text-green-700'  },
            { label: 'Réservés',      count: equipements?.data.filter(e => e.status === EquipementStatus.RESERVE).length ?? 0, color: 'bg-amber-500', bg: 'bg-amber-50',  text: 'text-amber-700'  },
            { label: 'Maintenance',   count: enMaintenance, color: 'bg-blue-500',  bg: 'bg-blue-50',   text: 'text-blue-700'   },
            { label: 'Hors service',  count: horsService,   color: 'bg-red-500',   bg: 'bg-red-50',    text: 'text-red-700'    },
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