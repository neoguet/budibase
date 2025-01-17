const Router = require("@koa/router")
const controller = require("../controllers/user")
const authorized = require("../../middleware/authorized")
const {
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")

const router = Router()

router
  .get(
    "/api/users/metadata",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.fetchMetadata
  )
  .get(
    "/api/users/metadata/:id",
    authorized(PermissionTypes.USER, PermissionLevels.READ),
    controller.findMetadata
  )
  .put(
    "/api/users/metadata",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    controller.updateMetadata
  )
  .post(
    "/api/users/metadata",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    usage,
    controller.createMetadata
  )
  .post(
    "/api/users/metadata/self",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    usage,
    controller.updateSelfMetadata
  )
  .delete(
    "/api/users/metadata/:id",
    authorized(PermissionTypes.USER, PermissionLevels.WRITE),
    usage,
    controller.destroyMetadata
  )

module.exports = router
