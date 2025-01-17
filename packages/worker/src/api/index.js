const Router = require("@koa/router")
const compress = require("koa-compress")
const zlib = require("zlib")
const { routes } = require("./routes")
const { buildAuthMiddleware } = require("@budibase/auth").auth

const NO_AUTH_ENDPOINTS = [
  "/api/admin/users/first",
  "/api/admin/auth",
  "/api/admin/auth/google",
  "/api/admin/auth/google/callback",
]

const router = new Router()

router
  .use(
    compress({
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      br: false,
    })
  )
  .use("/health", ctx => (ctx.status = 200))
  .use(buildAuthMiddleware(NO_AUTH_ENDPOINTS))
  // for now no public access is allowed to worker (bar health check)
  .use((ctx, next) => {
    if (!ctx.isAuthenticated) {
      ctx.throw(403, "Unauthorized - no public worker access")
    }
    return next()
  })

// error handling middleware
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.log.error(err)
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message,
      status: ctx.status,
    }
  }
})

router.get("/health", ctx => (ctx.status = 200))

// authenticated routes
for (let route of routes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

module.exports = router
