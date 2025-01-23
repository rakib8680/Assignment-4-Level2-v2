import { TUserRole } from "./user.interface";

export const userRoles: TUserRole[] = ["admin", "user"];

export const USER_ROLE_ENUM = {
  admin: "admin",
  user: "user",
} as const;
