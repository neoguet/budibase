const CouchDB = require("../../db")
const { StaticDatabases } = require("../../db/utils")
const { getDeployedApps } = require("../../utilities/workerRequests")

const PROD_HOSTING_URL = "app.budi.live"

function getProtocol(hostingInfo) {
  return hostingInfo.useHttps ? "https://" : "http://"
}

async function getURLWithPath(pathIfSelfHosted) {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  const path =
    hostingInfo.type === exports.HostingTypes.SELF ? pathIfSelfHosted : ""
  return `${protocol}${hostingInfo.hostingUrl}${path}`
}

exports.HostingTypes = {
  CLOUD: "cloud",
  SELF: "self",
}

exports.getHostingInfo = async () => {
  const db = new CouchDB(StaticDatabases.BUILDER_HOSTING.name)
  let doc
  try {
    doc = await db.get(StaticDatabases.BUILDER_HOSTING.baseDoc)
  } catch (err) {
    // don't write this doc, want to be able to update these default props
    // for our servers with a new release without needing to worry about state of
    // PouchDB in peoples installations
    doc = {
      _id: StaticDatabases.BUILDER_HOSTING.baseDoc,
      type: exports.HostingTypes.CLOUD,
      hostingUrl: PROD_HOSTING_URL,
      selfHostKey: "",
      templatesUrl: "prod-budi-templates.s3-eu-west-1.amazonaws.com",
      useHttps: true,
    }
  }
  return doc
}

exports.getAppUrl = async appId => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let url
  if (hostingInfo.type === exports.HostingTypes.CLOUD) {
    url = `${protocol}${appId}.${hostingInfo.hostingUrl}`
  } else {
    url = `${protocol}${hostingInfo.hostingUrl}/app`
  }
  return url
}

exports.getWorkerUrl = async () => {
  return getURLWithPath("/worker")
}

exports.getMinioUrl = async () => {
  return getURLWithPath("/")
}

exports.getCouchUrl = async () => {
  return getURLWithPath("/db")
}

exports.getSelfHostKey = async () => {
  const hostingInfo = await exports.getHostingInfo()
  return hostingInfo.selfHostKey
}

exports.getTemplatesUrl = async (appId, type, name) => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let path
  if (type && name) {
    path = `templates/type/${name}.tar.gz`
  } else {
    path = "manifest.json"
  }
  return `${protocol}${hostingInfo.templatesUrl}/${path}`
}

exports.getDeployedApps = getDeployedApps
