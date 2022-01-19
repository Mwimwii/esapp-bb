const { Env } = require("@foal/core");

module.exports = {
  type: Env.get("DB_CONNECTION"),

  host: Env.get("DB_HOST"),
  port: Number(Env.get("DB_PORT")),
  username: Env.get("DB_USERNAME"),
  password: Env.get("DB_PASSWORD"),
  database: Env.get("DB_NAME"),

  synchronize: Env.get("DB_SYNCHRONIZE") === 'true',

  entities: ["dist/app/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
  seeds: ["dist/seeds/**/*{.ts,.js}"],
  factories: ["src/factories/**/*{.ts,.js}"],
};
