import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

// create jwt token
export const createJwtToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

// match hashed password
export const isPasswordMatched = (
  PlainTextPassword: string,
  HashedPassword: string
) => {
  return bcrypt.compare(PlainTextPassword, HashedPassword);
};
