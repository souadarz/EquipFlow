import { EquipementStatus } from '../enums';
import { ICategory } from './category.interface';

export interface IEquipement {
  _id: string;
  serialNumber: string;
  name: string;
  description: string;
  status: EquipementStatus;
  category: ICategory;
  createdAt: string;
  imageUrl?: string;
  quantity: number;
}

export interface IEquipementPayload {
  name: string;
  description?: string;
  status?: EquipementStatus;
  serialNumber: string;
  category: string;
  imageUrl?: string;
  quantity?: number;
}

export interface IEquipementQuery {
  status?: EquipementStatus;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}