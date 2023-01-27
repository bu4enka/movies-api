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
    unique: true,
    validate: {
      notEmpty: {
        args: true,
        msg: 'EMPTY_TITLE'
      },
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1900,
        msg: "YEAR_MIN_1900"
      },
      max: {
        args: 2100,
        msg: "YEAR_MAX_2100"
      }
    }
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['VHS', 'DVD', 'Blu-Ray']],
        msg: "FORMAT_NOT_VALID"
      }
    }
  }
})
const Movie_Cast = sequelize.define('Movie_Cast', {})
Movie.belongsToMany(Actor, { through: Movie_Cast })
Actor.belongsToMany(Movie, { through: Movie_Cast })

module.exports = { Movie, Movie_Cast };