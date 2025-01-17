const CouchDB = require("../../db")
const { getScreenParams, generateScreenID } = require("../../db/utils")
const { AccessController } = require("../../utilities/security/roles")

exports.fetch = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)

  const screens = (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(element => element.doc)

  ctx.body = await new AccessController(appId).checkScreensAccess(
    screens,
    ctx.user.role._id
  )
}

exports.save = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  let screen = ctx.request.body

  if (!screen._id) {
    screen._id = generateScreenID()
  }
  const response = await db.put(screen)

  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
}

exports.destroy = async ctx => {
  const db = new CouchDB(ctx.appId)
  await db.remove(ctx.params.screenId, ctx.params.screenRev)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  ctx.status = 200
}
