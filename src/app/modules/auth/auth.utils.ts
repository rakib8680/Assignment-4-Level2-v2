import jwt, { JwtPayload } from "jsonwebtoken";

const createJwtToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export default createJwtToken;
