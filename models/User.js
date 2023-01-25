const { DataTypes } = require('sequelize');
const sequelize = require('./initModels');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// "email": "petro@gmail.com",
// "name": "Petrov Petro",
// "password": "super-password",
// "confirmPassword": "super-password"

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        msg: "Please, provide a valid email"
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    min: 4
  }
})

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt)
})

User.prototype.createJwt = function () {
  return jwt.sign({ userId: this.id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  })
}

User.prototype.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

module.exports = User;