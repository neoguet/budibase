const elasticlunr = require("elasticlunr")
const CouchDB = require("../db")
const emitter = require("../events")
const { getRowParams, getTableParams } = require("../db/utils")

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
    this.index = elasticlunr(function() {
      for (let property of Object.keys(table.schema)) {
        this.addField(property)
      }
      this.setRef("_id")
    })
    const rows = (
      await this.db.allDocs(
        getRowParams(this.tableId, null, {
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
    for (let row of rows) {
      this.index.addDoc(row)
    }
  }

  addRow(row) {
    try {
      this.index.removeDoc(row)
    } catch (err) {
      // can't do anything about error here, just suppress
    }
    this.index.addDoc(row)
  }

  deleteRow(row) {
    this.index.removeDoc(row)
  }

  search(params) {
    let options = {
      expand: true,
    }
    if (params.bool) {
      options = {
        boolean: params.bool,
      }
    }
    const results = this.index.search(params.query, options)
    let docs = []
    for (let result of results) {
      docs.push(this.index.documentStore.getDoc(result.ref))
    }
    return docs
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
