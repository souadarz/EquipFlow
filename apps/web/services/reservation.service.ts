import api from '@/lib/axios';
import {
  IReservation,
  IReservationPayload,
  IReservationQuery,
  IPaginatedResponse,
} from '@repo/shared';
import { ReservationStatus } from '@repo/shared';

//find aall reservation
export async function findAllReservations(query?: IReservationQuery) {
  try {
    const response = await api.get<IPaginatedResponse<IReservation>>('/reservations', {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return null;
  }
}

export async function findOneReservation(id: string) {
  try {
    const response = await api.get<IReservation>(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return null;
  }
}

export async function createReservation(payload: IReservationPayload) {
  try {
    const response = await api.post<IReservation>('/reservations', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  try {
    const response = await api.patch<IReservation>(`/reservations/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}

export async function deleteReservation(id: string) {
  try {
    await api.delete(`/reservations/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}