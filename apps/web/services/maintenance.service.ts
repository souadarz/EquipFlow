import api from '@/lib/axios';
import {
    IMaintenance,
    IMaintenancePayload,
    ICloseMaintenancePayload,
} from '@repo/shared';

export async function findAllMaintenances() {
    try {
        const response = await api.get<IMaintenance[]>('/maintenances');
        return response.data;
    } catch (error) {
        console.error('Error fetching maintenances:', error);
        return null;
    }
}

export async function findOneMaintenance(id: string) {
    try {
        const response = await api.get<IMaintenance>(`/maintenances/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching maintenance:', error);
        return null;
    }
}

export async function createMaintenance(payload: IMaintenancePayload) {
    try {
        const response = await api.post<IMaintenance>('/maintenances', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating maintenance:', error);
        throw error;
    }
}

export async function closeMaintenance(id: string, payload: ICloseMaintenancePayload) {
    try {
        const response = await api.patch<IMaintenance>(`/maintenances/${id}/close`, payload);
        return response.data;
    } catch (error) {
        console.error('Error closing maintenance:', error);
        throw error;
    }
}

export async function deleteMaintenance(id: string) {
    try {
        await api.delete(`/maintenances/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting maintenance:', error);
        throw error;
    }
}
