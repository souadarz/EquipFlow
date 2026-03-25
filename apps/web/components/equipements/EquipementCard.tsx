'use client';

import Link                    from 'next/link';
import EquipementStatusBadge   from '@/components/ui/EquipementStatusBadge';
import { EquipementStatus }    from '@repo/shared';
import { IEquipement } from '@repo/shared';

interface Props {
  equipement: IEquipement;
  isAdmin:    boolean;
  onReserve:  () => void;
  onDelete:   () => void;
}

// Icône selon la catégorie
const categoryIcon = (name?: string): string => {
  const n = name?.toLowerCase() ?? '';
  if (n.includes('btp') || n.includes('chantier')) return 'construction';
  if (n.includes('audio') || n.includes('son'))    return 'videocam';
  if (n.includes('info') || n.includes('pc'))      return 'computer';
  if (n.includes('tablet'))                        return 'tablet_mac';
  return 'inventory_2';
};

const categoryBg = (name?: string): string => {
  const n = name?.toLowerCase() ?? '';
  if (n.includes('btp'))   return 'bg-amber-50';
  if (n.includes('audio')) return 'bg-blue-50';
  if (n.includes('info'))  return 'bg-purple-50';
  return 'bg-bg';
};

export default function EquipementCard({ equipement, isAdmin, onReserve, onDelete }: Props) {
  const reservable = equipement.status === EquipementStatus.DISPONIBLE;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden
      transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">

      {/* Image / icône */}
      <Link href={`/equipements/${equipement._id}`}>
        <div className={`h-44 flex items-center justify-center ${categoryBg(equipement.category?.name)}`}>
          <span
            className="material-icons text-secondary"
            style={{ fontSize: '64px', opacity: 0.7 }}
          >
            {categoryIcon(equipement.category?.name)}
          </span>
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/equipements/${equipement._id}`}>
            <h3 className="font-bold text-gray-900 text-sm hover:text-primary transition-colors">
              {equipement.name}
            </h3>
          </Link>
          <EquipementStatusBadge status={equipement.status} />
        </div>

        <p className="text-textgray text-xs mb-4 font-mono">
          {equipement.serialNumber}
        </p>

        <div className="flex items-center justify-between gap-2">
          {/* Catégorie */}
          <span className="text-xs text-textgray bg-bg px-2.5 py-1 rounded-full">
            {equipement.category?.name ?? '—'}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Link
                  href={`/equipements/${equipement._id}/edit`}
                  className="text-textgray hover:text-primary transition-colors"
                  title="Modifier"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                </Link>
                <button
                  onClick={onDelete}
                  className="text-textgray hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>delete_outline</span>
                </button>
              </>
            )}

            {!isAdmin && (
              <button
                onClick={onReserve}
                disabled={!reservable}
                className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all
                  ${reservable
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {reservable ? 'Réserver' : 'Indisponible'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}