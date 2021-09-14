import { ConnectionOptions } from 'typeorm';

const { Env } = require('@foal/core');

const models = 'src/app/models';
const subscribers = 'src/app/subscribers';
const migrations = 'database/migrations';

export const creds: ConnectionOptions = {
    type: Env.get('DB_CONNECTION') || 'postgres',
    host: Env.get('DB_HOST') || 'localhost',
    port: Number(Env.get('DB_PORT')) || 5432,
    username: Env.get('DB_USERNAME') || 'titl',
    password: Env.get('DB_PASSWORD'),
    database: Env.get('DB_NAME') || 'titldb',
    synchronize: true,
    entities: [`${models}/**/*.js`],
    migrations: [`${migrations}/**/*.js`],
    subscribers: [`${subscribers}/**/*.js`],
};
