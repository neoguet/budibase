const CouchDB = require("../../../db")
const {
  generateGlobalUserID,
  getGlobalUserParams,
  StaticDatabases,
} = require("@budibase/auth").db
const { hash, getGlobalUserByEmail } = require("@budibase/auth").utils
const { UserStatus } = require("../../../constants")

const FIRST_USER_EMAIL = "test@test.com"
const FIRST_USER_PASSWORD = "test"
const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const { email, password, _id } = ctx.request.body

  // make sure another user isn't using the same email
  const dbUser = await getGlobalUserByEmail(email)
  if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
    ctx.throw(400, "Email address already in use.")
  }

  // get the password, make sure one is defined
  let hashedPassword
  if (password) {
    hashedPassword = await hash(password)
  } else if (dbUser) {
    hashedPassword = dbUser.password
  } else {
    ctx.throw(400, "Password must be specified.")
  }

  let user = {
    ...dbUser,
    ...ctx.request.body,
    _id: _id || generateGlobalUserID(),
    password: hashedPassword,
  }
  // add the active status to a user if its not provided
  if (user.status == null) {
    user.status = UserStatus.ACTIVE
  }
  try {
    const response = await db.post({
      password: hashedPassword,
      ...user,
    })
    ctx.body = {
      _id: response.id,
      _rev: response.rev,
      email,
    }
  } catch (err) {
    if (err.status === 409) {
      ctx.throw(400, "User exists already")
    } else {
      ctx.throw(err.status, err)
    }
  }
}

exports.firstUser = async ctx => {
  ctx.request.body = {
    email: FIRST_USER_EMAIL,
    password: FIRST_USER_PASSWORD,
    roles: {},
    builder: {
      global: true,
    },
  }
  await exports.save(ctx)
}

exports.destroy = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const dbUser = await db.get(ctx.params.id)
  await db.remove(dbUser._id, dbUser._rev)
  ctx.body = {
    message: `User ${ctx.params.id} deleted.`,
  }
}

// called internally by app server user fetch
exports.fetch = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  const users = response.rows.map(row => row.doc)
  // user hashed password shouldn't ever be returned
  for (let user of users) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = users
}

// called internally by app server user find
exports.find = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  let user
  try {
    user = await db.get(ctx.params.id)
  } catch (err) {
    // no user found, just return nothing
    user = {}
  }
  if (user) {
    delete user.password
  }
  ctx.body = user
}
