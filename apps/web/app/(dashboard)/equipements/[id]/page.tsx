'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import EquipementStatusBadge from '@/components/ui/EquipementStatusBadge';
import ReservationModal from '@/components/resevations/reservationModal';
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
        router.replace('/equipements');
        return;
      }

      setEquipement(data);
      setLoading(false);
    }

    fetchEquipement();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 min-h-[50vh] items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!equipement) return null;

  const reservable = equipement.status === EquipementStatus.DISPONIBLE;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-16">

      {/* Breadcrumb premium */}
      <div className="flex items-center gap-2 text-sm text-textgray bg-white w-max px-4 py-2 rounded-full shadow-sm border border-gray-100">
        <Link href="/equipements" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
          <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
          Retour au catalogue
        </Link>
        <span className="material-icons text-gray-300" style={{ fontSize: '18px' }}>chevron_right</span>
        <span className="text-gray-900 font-bold truncate max-w-[200px]">{equipement.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Colonne Gauche - Image Hero (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-sm group min-h-[400px] flex items-center justify-center">
            {equipement.imageUrl ? (
              <img
                src={equipement.imageUrl}
                alt={equipement.name}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <span className="material-icons text-secondary" style={{ fontSize: '120px', opacity: 0.2 }}>
                inventory_2
              </span>
            )}

            {/* Overlay Gradient pour la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-80"></div>

            {/* Badges flottants */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {equipement.category?.name ?? 'Générique'}
              </span>
              <EquipementStatusBadge status={equipement.status} />
            </div>

            {/* Infos flottantes bas */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mb-2 leading-tight">{equipement.name}</h1>
              <p className="opacity-90 font-mono text-sm bg-black/40 w-max px-2.5 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                SN: {equipement.serialNumber}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="material-icons text-primary rounded-lg bg-primary/10 p-1.5" style={{ fontSize: '20px' }}>description</span>
              Description
            </h2>
            {equipement.description ? (
              <p className="text-textgray text-base leading-relaxed whitespace-pre-line">
                {equipement.description}
              </p>
            ) : (
              <p className="text-gray-400 italic">Aucune description n&apos;a été fournie pour cet équipement.</p>
            )}
          </div>
        </div>

        {/* Colonne Droite - Détails & Actions (Span 5) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">

          {/* Card Disponibilité */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-primary"></div>
            <div className="p-8 space-y-8">

              <div>
                <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Disponibilité</h3>
                {reservable ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                      <span className="material-icons" style={{ fontSize: '32px' }}>check_circle</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-lg">Disponible</p>
                      <p className="text-green-600 font-semibold text-sm">Prêt pour réservation</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                      <span className="material-icons" style={{ fontSize: '32px' }}>front_hand</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-lg">Indisponible</p>
                      <p className="text-amber-600 font-semibold text-sm">Actuellement {equipement.status.replace('_', ' ').toLowerCase()}</p>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              <div>
                <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Détails de l&apos;enregistrement</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <span className="material-icons text-gray-400" style={{ fontSize: '18px' }}>event</span>
                      Ajouté le
                    </span>
                    <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                      {new Date(equipement.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Principales */}
              <div className="pt-2 space-y-3">
                {!isAdmin && (
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={!reservable}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base transition-all
                      ${reservable
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:-translate-y-1'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <span className="material-icons" style={{ fontSize: '20px' }}>event_available</span>
                    {reservable ? 'Réserver maintenant' : 'Indisponible'}
                  </button>
                )}

                {isAdmin && (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={`/equipements/${equipement._id}/edit`}
                      className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center
                        gap-2 text-sm bg-primary hover:bg-primary/90 text-white
                        shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                      Modifier
                    </Link>
                    <button
                      className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center
                        gap-2 text-sm bg-white border-2 border-red-50 text-red-600 hover:bg-red-50
                        transition-all hover:-translate-y-0.5"
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {showModal && <ReservationModal equipement={equipement} onClose={() => setShowModal(false)} />}
    </div>
  );
}