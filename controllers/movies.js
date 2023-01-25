const { readFile, writeFile } = require('fs').promises
const importFile = require('../middleware/importFile');
const Actor = require('../models/Actor');
const { Movie, Movie_Cast } = require('../models/Movie')
const path = require('path')

const getAllMovies = async (req, res) => {
  console.log(req.session);
  const movies = await Movie.findAll();
  res.status(200).json(movies)
}

const getMovie = async (req, res) => {
  const { id } = req.params
  const movie = await Movie.findByPk(id, {
    include: {
      model: Actor,
      through: {
        attributes: []
      }
    },
  })

  if (!movie) {
    return res.status(500).json(
      {
        status: 0,
        error: {
          fields: { id },
          code: "MOVIE_NOT_FOUND"
        }
      })
  }

  res.status(200).json(movie)
}

const updateMovie = async (req, res) => {
  const { id } = req.params
  const movie = await Movie.findByPk(id)

  if (!movie) {
    return res.status(500).json(
      {
        status: 0,
        error: {
          fields: { id },
          code: "MOVIE_NOT_FOUND"
        }
      })
  }

  await movie.update(req.body, { where: { id } })

  const updatedMov = await Movie.findByPk(id, {
    include: {
      model: Actor,
      through: {
        attributes: []
      }
    },
  })

  res.status(200).json({ data: updatedMov, status: 1 })
}

const deleteMovie = async (req, res) => {
  const { id } = req.params
  const movie = await Movie.destroy({
    where: {
      id
    }
  })

  if (!movie) return res.status(500).json(
    {
      status: 0,
      error: {
        fields: { id },
        code: "MOVIE_NOT_FOUND"
      }
    })

  res.status(200).json({ status: 1 })
}

const createMovie = async (req, res) => {
  if (!req.body || !req.body.title || !req.body.year || !req.body.format) {
    return res.status(500).json({
      status: 0,
      error: { code: "NO_DATA_PROVIDED" }
    })
  }
  const mov = req.body
  mov.actors = mov.actors.map(x => { return { name: x } })
  console.log(mov);
  const [movie, created] = await Movie.findOrCreate({
    where: { title: mov.title },
    defaults: mov,
    include: [Actor]
  })

  if (!created) {
    return res.status(500).json(
      {
        status: 0,
        error: {
          fields: { title: "NOT_UNIQUE" },
          code: "MOVIE_EXISTS"
        }
      })
  }

  res.status(201).json({ status: 1 })
}

const importMovies = async (req, res) => {
  const movies = await importFile(path.join(__dirname, '..', 'content', req.file.filename))
  await Movie.bulkCreate(movies, {
    // include: Actor,
    ignoreDuplicates: true,
  })
  const moviesTitles = movies.map(x => x.title)
  const addedMovies = await Movie.findAll({ where: { title: [moviesTitles] } })
  movies.forEach(async (movie) => {
    await Actor.bulkCreate(movie.actors, {
      ignoreDuplicates: true,
    })
    const addedActors = await Actor.findAll({ where: { name: [movie.actors.map(x => x.name)] } })
    addedActors.forEach(async (actor) => {
      const movId = addedMovies.find(x => x.title === movie.title).id
      await Movie_Cast.create({ movieId: movId, actorId: actor.dataValues.id })
    })
  })

  res.status(200).json({ data: addedMovies, status: 1 })
}

const importMoviesPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'import.html'))
}
module.exports = {
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  createMovie,
  importMovies,
  importMoviesPage
}