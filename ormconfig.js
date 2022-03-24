const { Env } = require("@foal/core");

module.exports = {
  type: Env.get("DB_CONNECTION") || "postgres",

  host: Env.get("DB_HOST") || "localhost",
  port: Number(Env.get("DB_PORT")) || 5432,
  username: Env.get("DB_USERNAME") || "postgres",
  password: Env.get("DB_PASSWORD") || "postgres",
  database: Env.get("DB_NAME") || "titldb",

  synchronize: Env.get("DB_SYNCHRONIZE") === 'true',

  entities: ["dist/app/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
  seeds: ["dist/seeds/**/*{.ts,.js}"],
  factories: ["src/factories/**/*{.ts,.js}"],
};
