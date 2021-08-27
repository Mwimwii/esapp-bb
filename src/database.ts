import { createConnection, ConnectionOptions } from "typeorm";

const models = "src/models";
const migrations = "database/migrations";
const subscribers = "src/subscribers";

export const initDBConnection = async () => {
  const creds = {
    type: process.env.DB_CONNECTION || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "titl",
    password: process.env.DB_PASSWORD || "super-secure",
    database: process.env.DB_NAME || "titldb",
    synchronize: true,
    entities: [`${models}/**/*.ts`],
    migrations: [`${migrations}/**/*.ts`],
    subscribers: [`${subscribers}/**/*.ts`],
  };

  await createConnection(creds as ConnectionOptions);
}
