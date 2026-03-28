import { IEquipement } from "./equipement.interface";

export interface IMaintenance {
    _id: string;
    equipement: Pick<IEquipement, '_id' | 'name' | 'status' | 'serialNumber' | 'imageUrl'>;
    startDate: string;
    endDate?: string;
    description: string;
    createdAt: string;
}

export interface IMaintenancePayload {
    equipement: string;
    startDate: string;
    description?: string;
}

export interface ICloseMaintenancePayload {
    endDate: string;
    description?: string;
}
