const builder = require("./builder")
const elasticsearch = require("./elasticsearch")
const env = require("../environment")

const SYSTEM = env.CLOUD ? elasticsearch : builder

exports.init = async appId => {
  await SYSTEM.startup(appId)
}

exports.search = async (appId, tableId, parameters) => {
  return await SYSTEM.search(appId, tableId, parameters)
}
