const User = require('../models/User')

const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: 0,
      code: "DATA_MISSING"
    })
  }

  if (password !== confirmPassword) {
    return res.status(400).send('passwords do not match')
  }


  const user = await User.create(req.body)

  const token = user.createJwt()
  res.status(201).json({ token, status: 1 })
}

module.exports = { createUser }