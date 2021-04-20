const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")
const { UserStatus } = require("@budibase/auth")

exports.LOGO_URL =
  "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg"

exports.FieldTypes = {
  STRING: "string",
  LONGFORM: "longform",
  OPTIONS: "options",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATETIME: "datetime",
  ATTACHMENT: "attachment",
  LINK: "link",
  AUTO: "auto",
}

exports.RelationshipTypes = {
  ONE_TO_MANY: "one-to-many",
  MANY_TO_ONE: "many-to-one",
  MANY_TO_MANY: "many-to-many",
}

exports.AuthTypes = {
  APP: "app",
  BUILDER: "builder",
  EXTERNAL: "external",
}

exports.USERS_TABLE_SCHEMA = {
  _id: "ta_users",
  type: "table",
  views: {},
  name: "Users",
  schema: {
    email: {
      type: exports.FieldTypes.STRING,
      constraints: {
        type: exports.FieldTypes.STRING,
        email: true,
        length: {
          maximum: "",
        },
        presence: true,
      },
      fieldName: "email",
      name: "email",
    },
    roleId: {
      fieldName: "roleId",
      name: "roleId",
      type: exports.FieldTypes.OPTIONS,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(BUILTIN_ROLE_IDS),
      },
    },
    status: {
      fieldName: "status",
      name: "status",
      type: exports.FieldTypes.OPTIONS,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(UserStatus),
      },
    },
  },
  primaryDisplay: "email",
}

exports.AutoFieldSubTypes = {
  CREATED_BY: "createdBy",
  CREATED_AT: "createdAt",
  UPDATED_BY: "updatedBy",
  UPDATED_AT: "updatedAt",
  AUTO_ID: "autoID",
}

exports.OBJ_STORE_DIRECTORY = "/app-assets/assets"
exports.BaseQueryVerbs = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
}

exports.ObjectStoreBuckets = {
  BACKUPS: "backups",
  APPS: "prod-budi-app-assets",
  TEMPLATES: "templates",
}
