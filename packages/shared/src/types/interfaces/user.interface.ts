import { Role } from "../enums";

export interface IUser {
    id: string;
    fullname: string;
    email: string;
    role: Role;
    createdAt: string;
}