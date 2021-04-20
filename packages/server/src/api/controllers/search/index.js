const { QueryBuilder, buildSearchUrl, search } = require("./utils")

exports.rowSearch = async ctx => {
  const appId = ctx.appId
  const { tableId } = ctx.params
  const { bookmark, query, raw } = ctx.request.body
  let url
  if (query) {
    url = new QueryBuilder(appId, query, bookmark).addTable(tableId).complete()
  } else if (raw) {
    url = buildSearchUrl({
      appId,
      query: raw,
      bookmark,
    })
  }
  ctx.body = await search(url)
}
