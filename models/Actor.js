const { DataTypes } = require('sequelize');
const sequelize = require('./initModels');

const Actor = sequelize.define('actor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
})

module.exports = Actor;