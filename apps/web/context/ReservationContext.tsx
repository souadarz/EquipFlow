'use client';

import {
  createContext,
  useState, useCallback, ReactNode,
} from 'react';
import toast               from 'react-hot-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  findAllReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
} from '@/services/reservation.service';
import {
  IReservation,
  IReservationPayload,
  IReservationQuery,
  IPaginatedResponse,
} from '@repo/shared';
import { ReservationStatus } from '@repo/shared';

interface ReservationContextType {
  reservations: IPaginatedResponse<IReservation> | null;
  loading:      boolean;
  fetchAll:     (query?: IReservationQuery) => Promise<void>;
  create:       (payload: IReservationPayload) => Promise<void>;
  updateStatus: (id: string, status: ReservationStatus) => Promise<void>;
  remove:       (id: string) => Promise<void>;
}

export const ReservationContext = createContext<ReservationContextType | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<IPaginatedResponse<IReservation> | null>(null);
  const [loading,      setLoading]      = useState(false);
  const handleError                     = useErrorHandler();

  const fetchAll = useCallback(async (query?: IReservationQuery) => {
    setLoading(true);
    try {
      const data = await findAllReservations(query);
      if (data) setReservations(data);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: IReservationPayload) => {
    try {
      await createReservation(payload);
      toast.success('Réservation créée avec succès');
      await fetchAll();
    } catch (e) {
      handleError(e);
      throw e;
    }
  }, [fetchAll]);

  const updateStatus = useCallback(async (id: string, status: ReservationStatus) => {
    try {
      await updateReservationStatus(id, status);
      toast.success('Statut mis à jour');
      await fetchAll();
    } catch (e) {
      handleError(e);
      throw e;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteReservation(id);
      toast.success('Réservation supprimée');
      await fetchAll();
    } catch (e) {
      handleError(e);
      throw e;
    }
  }, [fetchAll]);

  return (
    <ReservationContext.Provider value={{
      reservations, loading, fetchAll, create, updateStatus, remove,
    }}>
      {children}
    </ReservationContext.Provider>
  );
}