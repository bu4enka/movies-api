const { DataTypes } = require('sequelize');

const Actor = require('./Actor');
const sequelize = require('./initModels');

const Movie = sequelize.define('movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
const Movie_Cast = sequelize.define('Movie_Cast', {})
Movie.belongsToMany(Actor, { through: Movie_Cast })
Actor.belongsToMany(Movie, { through: Movie_Cast })

module.exports = {Movie, Movie_Cast};