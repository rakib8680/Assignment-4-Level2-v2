import { Model } from "mongoose";

export type TUserRole = "admin" | "user";

export interface TUser{
    username : string;
    email: string;
    password ?: string;
    role ?: TUserRole;
}



// static methods 
export interface StaticUserModel extends Model<TUser>{
    isUserExist (username:string):Promise<TUser> 
    isPasswordMatched (plainPassword:string, hashedPassword:string):Promise<boolean>
};
