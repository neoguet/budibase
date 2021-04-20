const fetch = require("node-fetch")
const env = require("../../environment")
const { checkSlashesInUrl } = require("../../utilities")
const { request } = require("../../utilities/workerRequests")

async function redirect(ctx, method) {
  const { path } = ctx.params
  const response = await fetch(
    checkSlashesInUrl(`${env.WORKER_URL}/api/admin/${path}`),
    request(ctx, {
      method,
      body: ctx.request.body,
    })
  )
  ctx.body = await response.json()
  const cookie = response.headers.get("set-cookie")
  if (cookie) {
    ctx.set("set-cookie", cookie)
  }
  ctx.status = response.status
  ctx.cookies
}

exports.redirectGet = async ctx => {
  await redirect(ctx, "GET")
}

exports.redirectPost = async ctx => {
  await redirect(ctx, "POST")
}

exports.redirectDelete = async ctx => {
  await redirect(ctx, "DELETE")
}
