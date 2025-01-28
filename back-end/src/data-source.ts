import 'dotenv/config';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number | undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/**/entities/*.ts`],
    migrations: [`${__dirname}/**/migrations/*.ts`],
});
