import dotenv from 'dotenv';
dotenv.config();

export default {
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    dev: process.env.NODE_ENV !== 'production',
    SALT: parseInt(process.env.SALT, 10) || 10,
};
