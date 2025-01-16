
export type TUserRole = "admin" | "user";

export type TUser = {
    username : string;
    email: string;
    password : string;
    role ?: TUserRole;
}