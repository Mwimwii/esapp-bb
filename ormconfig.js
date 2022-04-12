const { Env } = require("@foal/core");

module.exports = {
  type: Env.get("DB_CONNECTION") || "postgres",

  host: Env.get("DB_HOST") || "localhost",
  port: Number(Env.get("DB_PORT")) || 7000,
  username: Env.get("DB_USERNAME") || "esapp",
  password: Env.get("DB_PASSWORD") || "213299rjff",
  database: Env.get("DB_NAME") || "esappdb",

  synchronize: Env.get("DB_SYNCHRONIZE") === 'true',

  entities: ["dist/app/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
  seeds: ["dist/seeds/**/*{.ts,.js}"],
  factories: ["src/factories/**/*{.ts,.js}"],
};
