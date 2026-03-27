'use client';

import Link from 'next/link';
import EquipementStatusBadge from '@/components/ui/EquipementStatusBadge';
import { categoryIcon, categoryBg, getImageUrl } from '@/lib/quipement.utils';
import { EquipementStatus } from '@repo/shared';
import type { IEquipement } from '@repo/shared';

interface Props {
  equipement: IEquipement;
  variant: 'public' | 'dashboard';
  isAdmin?: boolean;
  onReserve?: () => void;
  onDelete?: () => void;
}

export default function EquipementCard({
  equipement,
  variant,
  isAdmin,
  onReserve,
  onDelete,
}: Props) {
  const reservable = equipement.status === EquipementStatus.DISPONIBLE;
  const imageUrl = getImageUrl(equipement.imageUrl);
  const detailHref = variant === 'public'
    ? `/equipement/${equipement._id}`
    : `/equipements/${equipement._id}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden
      transition-all duration-200 hover:-translate-y-0.5
      hover:shadow-lg hover:shadow-primary/10">

      {/* Visuel */}
      <Link href={detailHref} className="block w-full overflow-hidden">
        <div className={`h-44 w-full flex items-center justify-center overflow-hidden
          ${!imageUrl ? categoryBg(equipement.category?.name) : 'bg-gray-100'}`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={equipement.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span
              className="material-icons text-secondary"
              style={{ fontSize: '64px', opacity: 0.7 }}
            >
              {categoryIcon(equipement.category?.name)}
            </span>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-5">

        {/* Titre + badge */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={detailHref}>
            <h3 className="font-bold text-gray-900 text-sm hover:text-primary
              transition-colors leading-snug">
              {equipement.name}
            </h3>
          </Link>
          <EquipementStatusBadge status={equipement.status} />
        </div>

        {/* Catégorie + numéro de série */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-textgray bg-bg px-2.5 py-1 rounded-full">
            {equipement.category?.name ?? '—'}
          </span>
          <span className="text-xs text-textgray font-mono">
            SN: {equipement.serialNumber}
          </span>
        </div>

        {/* Actions selon variant */}
        {variant === 'public' && (
          <button
            onClick={onReserve}
            disabled={!reservable}
            className={`w-full py-2.5 rounded-xl text-sm font-bold
              transition-all active:scale-[0.98]
              ${reservable
                ? 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {reservable ? 'Réserver' : 'Indisponible'}
          </button>
        )}

        {variant === 'dashboard' && (
          <div className="flex items-center justify-between">
            <Link
              href={detailHref}
              className="text-xs text-secondary font-semibold hover:underline"
            >
              Voir le détail
            </Link>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/equipements/${equipement._id}/edit`}
                  className="text-textgray hover:text-primary transition-colors"
                  title="Modifier"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>
                    edit
                  </span>
                </Link>
                <button
                  onClick={onDelete}
                  className="text-textgray hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>
                    delete_outline
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}