'use client';

import {
    createContext,
    useState, useCallback, ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
    findAllMaintenances,
    createMaintenance,
    closeMaintenance,
    deleteMaintenance,
} from '@/services/maintenance.service';
import {
    IMaintenance,
    IMaintenancePayload,
    ICloseMaintenancePayload,
} from '@repo/shared';

interface MaintenanceContextType {
    maintenances: IMaintenance[] | null;
    loading: boolean;
    fetchAll: () => Promise<void>;
    create: (payload: IMaintenancePayload) => Promise<void>;
    close: (id: string, payload: ICloseMaintenancePayload) => Promise<void>;
    remove: (id: string) => Promise<void>;
}

export const MaintenanceContext = createContext<MaintenanceContextType | null>(null);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
    const [maintenances, setMaintenances] = useState<IMaintenance[] | null>(null);
    const [loading, setLoading] = useState(false);
    const handleError = useErrorHandler();

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllMaintenances();
            if (data) setMaintenances(data);
        } catch (e) {
            handleError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (payload: IMaintenancePayload) => {
        try {
            await createMaintenance(payload);
            toast.success('Maintenance lancée avec succès');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll, handleError]);

    const close = useCallback(async (id: string, payload: ICloseMaintenancePayload) => {
        try {
            await closeMaintenance(id, payload);
            toast.success('Maintenance clôturée avec succès');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll, handleError]);

    const remove = useCallback(async (id: string) => {
        try {
            await deleteMaintenance(id);
            toast.success('Maintenance supprimée');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll, handleError]);

    return (
        <MaintenanceContext.Provider value={{
            maintenances, loading, fetchAll, create, close, remove,
        }}>
            {children}
        </MaintenanceContext.Provider>
    );
}
