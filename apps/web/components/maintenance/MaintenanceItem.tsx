'use client';

import { IMaintenance } from '@repo/shared';
import { getImageUrl } from '@/lib/quipement.utils';
import { useMaintenance } from '@/hooks/useMaintenance';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
    maintenance: IMaintenance;
}

export default function MaintenanceItem({ maintenance }: Props) {
    const { remove, close } = useMaintenance();
    const { equipement, startDate, endDate, _id } = maintenance;

    const isClosed = !!endDate;

    // Guard for invalid date
    const startObj = new Date(startDate);
    const isValidDate = !isNaN(startObj.getTime());
    const elapsed = isValidDate
        ? formatDistanceToNow(startObj, { locale: fr })
        : 'Date inconnue';

    const handleClose = async () => {
        if (!confirm('Voulez-vous clôturer cette maintenance ? L\'équipement redeviendra disponible.')) return;
        try {
            await close(_id, { endDate: new Date().toISOString() });
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async () => {
        if (!confirm('Supprimer cette maintenance ?')) return;
        try {
            await remove(_id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex gap-5">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                    {equipement.imageUrl ? (
                        <img
                            src={getImageUrl(equipement.imageUrl) || ''}
                            alt={equipement.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="material-icons" style={{ fontSize: '32px' }}>build</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900 truncate">{equipement.name}</h3>
                                    {!isClosed && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                            Maintenance
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] font-mono text-textgray mt-0.5 uppercase tracking-tighter">
                                    #{equipement.serialNumber}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-textgray" title="Modifier">
                                    <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500"
                                    title="Supprimer"
                                >
                                    <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-textgray font-medium">
                                <span className="material-icons text-gray-300" style={{ fontSize: '16px' }}>calendar_month</span>
                                {isValidDate
                                    ? startObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                                    : '—'
                                }
                                {endDate && !isNaN(new Date(endDate).getTime()) && (
                                    ` - ${new Date(endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`
                                )}
                            </div>
                            {!isClosed && (
                                <div className="flex items-center gap-1.5 text-xs text-textgray font-medium">
                                    <span className="material-icons text-gray-300" style={{ fontSize: '16px' }}>schedule</span>
                                    {elapsed} écoulées
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <button className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-wider hover:underline">
                            Rapport Complet
                        </button>
                        {!isClosed && (
                            <button
                                onClick={handleClose}
                                className="text-[10px] font-bold text-green-600 uppercase tracking-wider hover:underline"
                            >
                                Clôturer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
