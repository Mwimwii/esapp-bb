const { Env } = require("@foal/core");

module.exports = {
  port: 80,
  settings: {
    disk: {
      driver: Env.get("DISK_DRIVER"),
      local: {
        directory: "uploaded",
      },
    },
    loggerFormat: "tiny",
    bodyParser: {
      limit: "50mb",
    },
    session: {
      store: "@foal/typeorm",
      csrf: {
        enabled: true,
      },
    },
    jwt: {
      secret: Env.get("JWT_SECRET"),
      cookie: {
        name: "titl",
        domain: Env.get("JWT_COOKIE_DOMAIN"),
        httpOnly: Env.get("JWT_COOKIE_HTTP_ONLY"),
        sameSite: "strict",
        secure: true,
      },
    },
  },
};
