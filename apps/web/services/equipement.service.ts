import api from '@/lib/axios';
import { IEquipement, IEquipementPayload, IEquipementQuery, IPaginatedResponse} from '@repo/shared';

//find All Equipements
export async function findAllEquipements(query?: IEquipementQuery) {
  try {
    const response = await api.get<IPaginatedResponse<IEquipement>>('/equipements', {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching equipements:', error);
    return null;
  }
}

// fin equipement par id
export async function findOneEquipement(id: string) {
  try {
    const response = await api.get<IEquipement>(`/equipements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipement:', error);
    return null;
  }
}

//create equip
export async function createEquipement(payload: IEquipementPayload) {
  try {
    const response = await api.post<IEquipement>('/equipements', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating equipement:', error);
    throw error;
  }
}

// update equip
export async function updateEquipement(id: string, payload: Partial<IEquipementPayload>) {
  try {
    const response = await api.patch<IEquipement>(`/equipements/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating equipement:', error);
    throw error;
  }
}

//delete equip
export async function deleteEquipement(id: string) {
  try {
    await api.delete(`/equipements/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting equipement:', error);
    throw error;
  }
}