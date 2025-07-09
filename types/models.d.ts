import { Email, Uuid } from "./types";

export interface UserModel {
    id: Uuid,
    username: string,
    email: Email,
    phone: string,
    password: string,
    verifiedEmail: boolean,
    verifiedPhone: boolean
}