import path from 'path';
import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const envPath = env === "development" ? path.resolve('.env.development') : path.resolve('.env.production');

config({ path: envPath });

export const PORT = process.env.PORT

export const MONGO_URI = process.env.MONGO_URI

export const DB_NAME = process.env.DB_NAME

export const ADMIN_ACCESS_JWT_SECRET_KEY = process.env.ADMIN_ACCESS_JWT_SECRET_KEY
export const ADMIN_REFRESH_JWT_SECRET_KEY = process.env.ADMIN_REFRESH_JWT_SECRET_KEY

export const USER_ACCESS_JWT_SECRET_KEY = process.env.USER_ACCESS_JWT_SECRET_KEY
export const USER_REFRESH_JWT_SECRET_KEY = process.env.USER_REFRESH_JWT_SECRET_KEY

export const ACCESS_TOKEN_EXPIRE_TIME = process.env.ACCESS_TOKEN_EXPIRE_TIME
export const REFRESH_TOKEN_EXPIRE_TIME = process.env.REFRESH_TOKEN_EXPIRE_TIME

export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) 
export const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID