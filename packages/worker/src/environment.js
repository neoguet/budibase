function isDev() {
  return process.env.NODE_ENV !== "production"
}

function isTest() {
  return (
    process.env.NODE_ENV === "jest" ||
    process.env.NODE_ENV === "cypress" ||
    process.env.JEST_WORKER_ID != null
  )
}

let LOADED = false
if (!LOADED && isDev()) {
  require("dotenv").config()
  LOADED = true
}

module.exports = {
  SELF_HOSTED: process.env.SELF_HOSTED,
  PORT: process.env.PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_URL: process.env.MINIO_URL,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  /* TODO: to remove - once deployment removed */
  SELF_HOST_KEY: process.env.SELF_HOST_KEY,
  COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
  COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
  isDev,
  isTest,
  isProd: () => {
    return !isDev()
  },
}
