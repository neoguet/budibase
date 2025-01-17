const jwt = require("jsonwebtoken")
const { UserStatus } = require("../../constants")
const { compare } = require("../../hashing")
const env = require("../../environment")
const { getGlobalUserByEmail } = require("../../utils")

const INVALID_ERR = "Invalid Credentials"

exports.options = {}

/**
 * Passport Local Authentication Middleware.
 * @param {*} email - username to login with
 * @param {*} password - plain text password to log in with
 * @param {*} done - callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
exports.authenticate = async function(email, password, done) {
  if (!email) return done(null, false, "Email Required.")
  if (!password) return done(null, false, "Password Required.")

  const dbUser = await getGlobalUserByEmail(email)
  if (dbUser == null) {
    return done(null, false, { message: "User not found" })
  }

  // check that the user is currently inactive, if this is the case throw invalid
  if (dbUser.status === UserStatus.INACTIVE) {
    return done(null, false, { message: INVALID_ERR })
  }

  // authenticate
  if (await compare(password, dbUser.password)) {
    const payload = {
      userId: dbUser._id,
    }

    dbUser.token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "1 day",
    })
    // Remove users password in payload
    delete dbUser.password

    return done(null, dbUser)
  } else {
    done(new Error(INVALID_ERR), false)
  }
}
