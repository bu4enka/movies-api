const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const cookiesToken = req.cookies['token']
  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !cookiesToken) {
    return res.status(401).json({
      status: 0,
      error: {
        fields: {
          token: "REQUIRED"
        },
        code: "TOKEN_REQUIRED"
      }
    })
  }

  const token = cookiesToken || authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 0,
      error: {
        code: "UNATHORIZED"
      }
    })
  }
}

module.exports = auth