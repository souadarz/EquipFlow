import { ReservationStatus } from '@repo/shared';

const config: Record<ReservationStatus, { label: string; className: string }> = {
  [ReservationStatus.ATTENTE]: { label: '● En attente', className: 'bg-amber-50 text-amber-700' },
  [ReservationStatus.ACTIVE]: { label: '● Active', className: 'bg-blue-50  text-blue-700' },
  [ReservationStatus.CONFIRME]: { label: '✓ Confirmée', className: 'bg-green-50 text-green-700' },
  [ReservationStatus.ANNULE]: { label: '✕ Annulée', className: 'bg-red-50   text-red-700' },
  [ReservationStatus.COMPLETE]: { label: '✓ Complétée', className: 'bg-gray-100 text-textgray' },
};

export default function ReservationStatusBadge({
  status,
}: {
  status: ReservationStatus;
}) {
  const { label, className } = config[status] ?? config[ReservationStatus.ACTIVE];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}