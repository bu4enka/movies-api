const { DataTypes } = require('sequelize');
const sequelize = require('./initModels');

const Actor = sequelize.define('actor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Actor;