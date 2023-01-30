const { readFile, writeFile } = require('fs').promises
const Sequelize = require('sequelize')
const path = require('path');
const importFile = require('../middleware/importFile');
const Actor = require('../models/Actor');
const { Movie, Movie_Cast } = require('../models/Movie');
const ActorNameError = require('../errors/actor-validation');
const MovieNotFound = require('../errors/movie-not-found');
const { DuplicateFileError } = require('../errors/file-import');

const Op = Sequelize.Op

const getAllMovies = async (req, res) => {
  const { sort, name, title, sortField } = req.query
  const options = {
    order: [['id', 'asc']]
  }

  if (typeof sort !== 'undefined' && (sort.toLowerCase() === 'asc' || sort.toLowerCase() == 'desc')) {
    options.order = [[
      Sequelize.fn('lower', Sequelize.col('title')),
      sort]]
  }
  if (typeof sortField !== 'undefined' && ((sortField.toLowerCase() === 'id') || (sortField.toLowerCase() === 'title') || (sortField.toLowerCase() === 'year'))) {
    const sortOrder = typeof sort !== 'undefined' ? sort : 'ASC'
    options.order = [[
      Sequelize.fn('lower', Sequelize.col(sortField)),
      sortOrder
    ]]
  }

  if (typeof name !== 'undefined' && name.length > 0) {
    options.include = { model: Actor, where: { name: { [Op.like]: `%${name}%` } } }
  }
  if (typeof title !== 'undefined' && title.length > 0) {
    options.where = { title: { [Op.like]: `%${title}%` } }
  }

  const movies = await Movie.findAll(options);

  res.status(200).json({ data: movies, status: 1 })
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
    throw new MovieNotFound('MOVIE_NOT_FOUND', id)
  }

  res.status(200).json({ data: movie, status: 1 })
}

const updateMovie = async (req, res) => {
  const { id } = req.params
  const movie = await Movie.findByPk(id)

  if (!movie) {
    throw new MovieNotFound('MOVIE_NOT_FOUND', id)
  }

  const mov = req.body
  const regex = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'g')
  const validateActors = mov.actors.filter(x => !x.match(regex))

  if (validateActors.length > 0) {
    throw new ActorNameError('ACTOR_NAME_NOT_VALID', validateActors);
  }
  mov.actors = mov.actors.map(x => {
    return { name: x }
  })

  await Movie_Cast.destroy({ where: { movieId: id } })

  for await (const act of mov.actors) {
    const [actor, created] = await Actor.findOrCreate({
      where: { name: act.name }, defaults: act
    })
    await Movie_Cast.create({ movieId: id, actorId: actor.id })
  }

  await movie.update(req.body, { where: { id } })

  const updatedMov = await Movie.findAll({
    where: { id: id },
    include: { model: Actor, through: { attributes: [] } },
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

  if (!movie) throw new MovieNotFound('MOVIE_NOT_FOUND', id)

  res.status(200).json({ status: 1 })
}

const createMovie = async (req, res) => {
  const { title, year, format } = req.body
  if (!req.body || !title || !year || !format) {
    return res.status(500).json({
      status: 0,
      error: { code: "NO_DATA_PROVIDED" }
    })
  }

  const mov = req.body
  const regex = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'g')
  const validateActors = mov.actors.filter(x => !x.match(regex))

  if (validateActors.length > 0) {
    throw new ActorNameError('ACTOR_NAME_NOT_VALID', validateActors);
  }
  mov.actors = mov.actors.map(x => {
    return { name: x }
  })


  const movie = await Movie.create(mov, {
    include: {
      model: Actor,
      ignoreDuplicates: true,
      through: {
        attributes: []
      }
    }
  })

  res.status(201).json({ data: movie, status: 1 })
}

const importMovies = async (req, res) => {
  const movies = await importFile(path.join(__dirname, '..', 'content', req.file.filename))

  //ignoreDuplicates doesn't spread on Actor and Movie_Cast tables, that's why I decided to write data via foreach loops 
  let newMovies = []
  for await (const movie of movies) {
    const [mov, created] = await Movie.findOrCreate({ where: { title: movie.title }, defaults: movie, ignoreDuplicates: true })
    if (created) {
      newMovies = [...newMovies, mov.id]

      if (movie.actors.length > 0) {
        const regex = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'g')
        const validateActors = movie.actors.filter(x => !x.name.match(regex))

        if (validateActors.length > 0) {
          throw new ActorNameError('ACTOR_NAME_NOT_VALID', validateActors);
        }
        for await (const actor of movie.actors) {
          const [act, created] = await Actor.findOrCreate({ where: { name: actor.name }, defaults: actor })
          await Movie_Cast.create({ movieId: mov.id, actorId: act.id }, { ignoreDuplicates: true })
        }
      }
    }
  }
  if (newMovies.length < 1) {
    throw new DuplicateFileError('MOVIES_ALREADY_EXIST')
  }

  const addedMovies = await Movie.findAll({ where: { id: newMovies }, include: { model: Actor, through: { attributes: [] } } })

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