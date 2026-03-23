import { Types } from 'mongoose';
import { Role } from '../enums';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullname: string;
  email: string;
  password: string;
}