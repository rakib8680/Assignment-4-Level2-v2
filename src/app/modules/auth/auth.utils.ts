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

// verify jwt token
export const verifyJwtToken = (token:string, secret:string)=> jwt.verify(token, secret);



// match hashed password
// export const isPasswordMatched = (
//   PlainTextPassword: string,
//   HashedPassword: string
// ) => {
//   return bcrypt.compare(PlainTextPassword, HashedPassword);
// };
