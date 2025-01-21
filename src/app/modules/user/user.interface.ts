import { Model } from "mongoose";

export type TUserRole = "admin" | "user";

export interface TUser{
    username : string;
    email: string;
    password ?: string;
    role ?: TUserRole;
}



// static method to check if user exist by id
export interface StaticUserModel extends Model<TUser>{
    isUserExist (id:string):Promise<TUser> 
}