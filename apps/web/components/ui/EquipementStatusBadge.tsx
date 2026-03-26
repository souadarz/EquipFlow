import { EquipementStatus } from '@repo/shared';

const config: Record<EquipementStatus, { label: string; className: string }> = {
  [EquipementStatus.DISPONIBLE]:     { label: '🟢 Disponible',    className: 'bg-green-50 text-green-700' },
  [EquipementStatus.RESERVE]:        { label: '🟠 Réservé',       className: 'bg-amber-50 text-amber-700' },
  [EquipementStatus.EN_MAINTENANCE]: { label: '🔵 Maintenance',   className: 'bg-blue-50  text-blue-700'  },
  [EquipementStatus.HORS_SERVICE]:   { label: '🔴 Hors service',  className: 'bg-red-50   text-red-700'   },
};

export default function EquipementStatusBadge({
  status,
}: {
  status: EquipementStatus;
}) {
  const { label, className } = config[status] ?? config[EquipementStatus.DISPONIBLE];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}