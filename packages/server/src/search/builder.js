const MiniSearch = require("minisearch")
const CouchDB = require("../db")
const emitter = require("../events")
const { getRowParams, getTableParams } = require("../db/utils")
const { attachLinkInfo } = require("../db/linkedRows")

const STATIC_FIELDS = ["_id", "_rev", "type", "tableId"]

class ControllerStorage {
  constructor() {
    this.controllers = {}
  }

  doesExist(appId, tableId = null) {
    let exists = false
    if (this.controllers[appId]) {
      exists = true
    } else {
      return exists
    }
    if (tableId) {
      exists = !!this.controllers[appId][tableId]
    }
    return exists
  }

  setController(appId, tableId, controller) {
    if (!this.controllers[appId]) {
      this.controllers[appId] = {}
    }
    this.controllers[appId][tableId] = controller
  }

  getController(appId, tableId) {
    if (!this.doesExist(appId, tableId)) {
      return null
    }
    return this.controllers[appId][tableId]
  }
}

const STORAGE = new ControllerStorage()

class SearchController {
  constructor(appId) {
    this.appId = appId
    this.db = new CouchDB(appId)
  }

  async init(tableId) {
    const controller = this
    controller.tableId = tableId
    controller.table = await this.db.get(tableId)
    emitter.on("table:save", async event => {
      if (controller.checkEvent(event)) {
        controller.table = event.table
        await controller.buildIndex()
      }
    })
    const rowSave = event => {
      if (controller.checkEvent(event)) {
        controller.addRow(event.row)
      }
    }
    emitter.on("row:save", rowSave)
    emitter.on("row:update", rowSave)
    emitter.on("row:delete", event => {
      if (controller.checkEvent(event)) {
        controller.deleteRow(event.row)
      }
    })
    await controller.buildIndex()
  }

  checkEvent(event) {
    return event.tableId === this.tableId && event.appId === this.appId
  }

  async buildIndex() {
    const table = this.table
    const fields = Object.keys(table.schema)
    this.index = new MiniSearch({
      fields,
      storeFields: fields.concat(STATIC_FIELDS),
      idField: "_id",
    })
    const rows = (
      await this.db.allDocs(
        getRowParams(this.tableId, null, {
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
    const linkRows = await attachLinkInfo(this.appId, rows)
    for (let row of linkRows) {
      this.addRow(row)
    }
  }

  findOnId(row) {
    return this.index.search(row._id, {
      fields: ["_id"],
    })
  }

  addRow(row) {
    const found = this.findOnId(row)
    if (found && found.length !== 0) {
      this.index.remove(row)
    }
    this.index.add(row)
  }

  deleteRow(row) {
    this.index.remove(row)
  }

  search(params) {
    let options = {
      fuzzy: true,
    }
    let results
    if (typeof params.query === "object") {
      results = this.advancedSearch(params)
    } else {
      results = this.index.search(params.query, options)
    }
    return results
  }

  // break this out, some crazy stuff going on here
  advancedSearch(params) {
    const orConditions =
      !params.boolean || params.boolean.toLowerCase() === "or"
    const config = {
      fuzzy: true,
    }

    let results = []
    let first = true
    for (let prop of Object.keys(params.query)) {
      const query = params.query[prop]
      if (query == null || query === "") {
        continue
      }
      // syntax is very weird, this is undocumented
      const found = this.index.search(query, {
        ...config,
        fields: [prop],
        combineWith: "AND",
      })
      // OR condition, union of arrays
      if (orConditions) {
        results = results.concat(found)
      }
      // AND condition, need to populate first
      else if (first) {
        results = found
        first = false
      }
      // get the intersection of arrays for AND
      else {
        const foundIds = found.map(result => result._id)
        results = results.filter(result => foundIds.includes(result._id))
      }
    }
    // make sure unique and remove the search result info
    results = [...new Set(results)]
    for (let result of results) {
      delete result.match
      delete result.score
      delete result.id
      delete result.terms
    }
    return results
  }
}

// creates all tables at startup
exports.startup = async appId => {
  // these app controllers have already been configured
  if (STORAGE.doesExist(appId)) {
    return
  }
  emitter.on("table:save", async event => {
    if (
      event.table &&
      event.table.tableId &&
      !STORAGE.doesExist(event.appId, event.tableId)
    ) {
      await exports.init(event.appId, event.tableId)
    }
  })
  const db = new CouchDB(appId)
  let tableIds = (await db.allDocs(getTableParams())).rows.map(row => row.id)
  const promises = []
  for (let tableId of tableIds) {
    promises.push(exports.init(appId, tableId))
  }
  await Promise.all(promises)
}

// creates a controller an appId, needed if new table created etc
exports.init = async (appId, tableId) => {
  if (STORAGE.doesExist(appId, tableId)) {
    return
  }
  const controller = new SearchController(appId)
  await controller.init(tableId)
  STORAGE.setController(appId, tableId, controller)
}

exports.search = async (appId, tableId, params) => {
  if (!STORAGE.doesExist(appId, tableId)) {
    await exports.init(appId, tableId)
  }
  const controller = STORAGE.getController(appId, tableId)
  return controller.search(params)
}
