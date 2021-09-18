import dotenv from 'dotenv';
dotenv.config();

export default {
    DATABASE: {
        URI: process.env.DB_URI,
        OPTIONS: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    dev: process.env.NODE_ENV !== 'production'
}
