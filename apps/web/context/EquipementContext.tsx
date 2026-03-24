'use client';

import {
    createContext,
    useState, useCallback, ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
    findAllEquipements,
    createEquipement,
    updateEquipement,
    deleteEquipement,
} from '@/services/equipement.service';
import {
    IEquipement,
    IEquipementPayload,
    IEquipementQuery,
    IPaginatedResponse,
} from '@repo/shared';

interface EquipementContextType {
    equipements: IPaginatedResponse<IEquipement> | null;
    loading: boolean;
    fetchAll: (query?: IEquipementQuery) => Promise<void>;
    create: (payload: IEquipementPayload) => Promise<void>;
    update: (id: string, payload: Partial<IEquipementPayload>) => Promise<void>;
    remove: (id: string) => Promise<void>;
}

export const EquipementContext = createContext<EquipementContextType | null>(null);

export function EquipementProvider({ children }: { children: ReactNode }) {
    const [equipements, setEquipements] = useState<IPaginatedResponse<IEquipement> | null>(null);
    const [loading, setLoading] = useState(false);
    const handleError = useErrorHandler();

    const fetchAll = useCallback(async (query?: IEquipementQuery) => {
        setLoading(true);
        try {
            const data = await findAllEquipements(query);
            if (data) setEquipements(data);
        } catch (e) {
            handleError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (payload: IEquipementPayload) => {
        try {
            await createEquipement(payload);
            toast.success('Équipement créé avec succès');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll]);

    const update = useCallback(async (id: string, payload: Partial<IEquipementPayload>) => {
        try {
            await updateEquipement(id, payload);
            toast.success('Équipement mis à jour');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll]);

    const remove = useCallback(async (id: string) => {
        try {
            await deleteEquipement(id);
            toast.success('Équipement supprimé');
            await fetchAll();
        } catch (e) {
            handleError(e);
            throw e;
        }
    }, [fetchAll]);

    return (
        <EquipementContext.Provider value={{
            equipements, loading, fetchAll, create, update, remove,
        }}>
            {children}
        </EquipementContext.Provider>
    );
}