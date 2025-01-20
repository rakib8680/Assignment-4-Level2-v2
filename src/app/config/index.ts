
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.join(process.cwd(), '.env')});

export default{
    port : process.env.PORT || 5000,
    databaseURL : process.env.DATABASE_URL,
    bcryptSalt : process.env.BCRYPT_SALT_ROUNDS,
    jwtSecret : process.env.JWT_ACCESS_SECRET,
    jwtExpiresIn : process.env.JWT_EXPIRES_IN,
}
