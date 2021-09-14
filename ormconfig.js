const { Env } = require("@foal/core");

module.exports = {
  type: Env.get("DB_CONNECTION") || "postgres",

  host: Env.get("DB_HOST") || "localhost",
  port: Number(Env.get("DB_PORT")) || 5432,
  username: Env.get("DB_USERNAME") || "titl",
  password: Env.get("DB_PASSWORD"),
  database: Env.get("DB_NAME") || "titldb",

  synchronize: Boolean(Env.get("DB_SYNCHRONIZE")),

  entities: ["dist/app/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
};
