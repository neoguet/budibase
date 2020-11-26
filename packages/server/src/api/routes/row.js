const Router = require("@koa/router")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const Joi = require("joi")
const joiValidator = require("../../middleware/joi-validator")
const {
  PermissionLevels,
  PermissionTypes,
} = require("../../utilities/security/permissions")

const router = Router()

function searchValidator() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    query: Joi.object().unknown(true).required(),
    bool: Joi.string().optional().valid("AND", "OR"),
  }).unknown(true))
}

router
  .get(
    "/api/:tableId/:rowId/enrich",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchEnrichedRow
  )
  .get(
    "/api/:tableId/rows",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchTableRows
  )
  .get(
    "/api/:tableId/rows/:rowId",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.find
  )
  .post(
    "/api/:tableId/rows",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.save
  )
  .patch(
    "/api/:tableId/rows/:id",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.patch
  )
  .post(
    "/api/:tableId/rows/validate",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.validate
  )
  .delete(
    "/api/:tableId/rows/:rowId/:revId",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.destroy
  )
  .post(
    "/api/:tableId/rows/search",
    authorized(PermissionTypes.TABLE, PermissionTypes.READ),
    //searchValidator(),
    rowController.search
  )

module.exports = router
