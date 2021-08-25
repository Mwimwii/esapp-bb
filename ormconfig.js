const models = "src/models";
const migrations = "database/migrations";
const subscribers = "src/subscribers";

module.exports = {
  type: process.env.TYPEORM_CONNECTION || "postgres",
  host: process.env.TYPEORM_HOST || "localhost",
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME || "titl",
  password: process.env.TYPEORM_PASSWORD || "super-secure",
  database: process.env.TYPEORM_DATABASE || "titldb",
  synchronize: true,
  entities: [`${models}/**/*.ts`],
  migrations: [`${migrations}/**/*.ts`],
  subscribers: [`${subscribers}/**/*.ts`],
  cli: {
    entitiesDir: models,
    migrationsDir: migrations,
    subscribersDir: subscribers,
  },
};
