const { Env } = require("@foal/core");

module.exports = {
  port: 8000,
  settings: {
    loggerFormat: "tiny",
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
        domain: "admin.titl.app",
        httpOnly: Env.get("JWT_COOKIE_HTTP_ONLY"),
        sameSite: "strict",
        secure: true,
      },
    },
  },
};
