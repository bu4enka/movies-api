const User = require("../models/User")

const createSession = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400)

  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(401).json({
      status: 0,
      error: {
        fields: {
          email: "AUTHENTICATION_FAILED",
        },
        code: "AUTHENTICATION_FAILED"
      }
    })
  }

  const isPassCorrect = await user.checkPassword(password)
  if (!isPassCorrect) return res.status(401).json({
    status: 0,
    error: {
      fields: {
        password: "AUTHENTICATION_FAILED"
      },
      code: "AUTHENTICATION_FAILED"
    }
  })

  const token = user.createJwt()
  res.set('Authorization', `Bearer ${token}`)
  res.cookie('token', token, { maxAge: 60000 })
  res.json({token}).redirect(`http://localhost:${process.env.APP_PORT}/api/v1/movies/import/static`)
}

module.exports = { createSession }