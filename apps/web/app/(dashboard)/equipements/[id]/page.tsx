'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import EquipementStatusBadge from '@/components/ui/EquipementStatusBadge';
import ReservationModal from '@/components/reservations/ReservationModal';
import { EquipementStatus } from '@repo/shared';
import type { IEquipement } from '@repo/shared';
import { findOneEquipement } from '@/services/equipement.service';

export default function EquipementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [equipement, setEquipement] = useState<IEquipement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchEquipement() {
      setLoading(true);
      const data = await findOneEquipement(id);

      if (!data) {
        router.replace('/equipements'); // redirection si pas trouvé
        return;
      }

      setEquipement(data);
      setLoading(false);
    }

    fetchEquipement();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!equipement) return null;

  const reservable = equipement.status === EquipementStatus.DISPONIBLE;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-textgray">
        <Link href="/equipements" className="hover:text-primary transition-colors">
          Équipements
        </Link>
        <span className="material-icons" style={{ fontSize: '16px' }}>chevron_right</span>
        <span className="text-gray-900 font-medium">{equipement.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <div className="space-y-5">
          <div className="bg-bg rounded-2xl h-72 flex items-center justify-center border border-gray-200">
            <span className="material-icons text-secondary" style={{ fontSize: '96px', opacity: 0.6 }}>
              inventory_2
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-gray-900">{equipement.name}</h1>
              <EquipementStatusBadge status={equipement.status} />
            </div>

            <div className="space-y-3">
              {[
                { label: 'N° de série', value: equipement.serialNumber, mono: true },
                { label: 'Catégorie', value: equipement.category?.name ?? '—' },
                {
                  label: 'Ajouté le',
                  value: new Date(equipement.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }),
                },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-textgray text-sm font-medium">{row.label}</span>
                  <span className={`text-sm font-semibold text-gray-800 ${row.mono ? 'font-mono' : ''}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {equipement.description && (
              <p className="text-textgray text-sm mt-4 leading-relaxed">{equipement.description}</p>
            )}
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-icons text-secondary" style={{ fontSize: '20px' }}>
                calendar_month
              </span>
              Disponibilité
            </h3>

            {reservable ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="material-icons text-green-600" style={{ fontSize: '24px' }}>check_circle</span>
                <div>
                  <p className="font-semibold text-green-700 text-sm">Disponible maintenant</p>
                  <p className="text-green-600/80 text-xs mt-0.5">Cet équipement peut être réservé immédiatement.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <span className="material-icons text-amber-600" style={{ fontSize: '24px' }}>schedule</span>
                <div>
                  <p className="font-semibold text-amber-700 text-sm">
                    Actuellement {equipement.status.replace('_', ' ')}
                  </p>
                  <p className="text-amber-600/80 text-xs mt-0.5">Cet équipement n'est pas disponible à la réservation.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>

            {!isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                disabled={!reservable}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2
                  text-sm transition-all
                  ${reservable
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <span className="material-icons" style={{ fontSize: '18px' }}>event_available</span>
                {reservable ? 'Réserver cet équipement' : 'Indisponible à la réservation'}
              </button>
            )}

            {isAdmin && (
              <>
                <Link
                  href={`/equipements/${equipement._id}/edit`}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center
                    gap-2 text-sm bg-primary hover:bg-primary/90 text-white
                    shadow-lg shadow-primary/20 transition-all"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                  Modifier l'équipement
                </Link>
                <Link
                  href="/maintenance/new"
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center
                    gap-2 text-sm border-2 border-amber-200 text-amber-700
                    hover:bg-amber-50 transition-all"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>build</span>
                  Ouvrir une maintenance
                </Link>
              </>
            )}

            <Link
              href="/equipements"
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center
                gap-2 text-sm border border-gray-200 text-textgray hover:bg-gray-50 transition-all"
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>

      {showModal && <ReservationModal equipement={equipement} onClose={() => setShowModal(false)} />}
    </div>
  );
}