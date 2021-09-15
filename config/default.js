const { Env } = require('@foal/core');

module.exports = {
  port: 8000,
  settings: {
    loggerFormat: "tiny",
    jwt: {
      secret: Env.get('JWT_SECRET')
    },
    session: {
      "store": "@foal/typeorm"
    }
  }
}
