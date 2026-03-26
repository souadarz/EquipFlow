import { ReservationStatus } from "../enums";
import { IEquipement } from "./equipement.interface";
import { IUser } from "./user.interface";

export interface IReservation {
  _id:        string;
  equipement: Pick<IEquipement, '_id' | 'serialNumber'| 'name' | 'status'>;
  user:       Pick<IUser, 'id' | 'fullname' | 'email'>;
  startDate:  string;
  endDate:    string;
  status:     ReservationStatus;
  createdAt:  string;
}

export interface IReservationPayload {
  equipement: string;
  startDate:  string;
  endDate:    string;
}

export interface IReservationQuery {
  status?:     ReservationStatus;
  equipement?: string;
  user?:       string;
  from?:       string;
  to?:         string;
  page?:       number;
  limit?:      number;
}