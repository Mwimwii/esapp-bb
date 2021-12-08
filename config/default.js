const { Env } = require("@foal/core");

module.exports = {
  port: 8000,
  settings: {
    aws: {
      accessKeyId: Env.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: Env.get("AWS_SECRET_ACCESS_KEY"),
    },
    disk: {
      driver: Env.get("DISK_DRIVER"),
      local: {
        directory: "uploaded",
      },
      s3: {
        bucket: Env.get("AWS_BUCKET"),
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
