const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const FileImportError = require('../errors/file-import');

const upload = multer({
  dest: './content/',
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.txt') return cb(new FileImportError(''))
   
    cb(null, true)
  }
});
const type = upload.single('movie_file');

const {
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  createMovie,
  importMovies,
  importMoviesPage
} = require('../controllers/movies');

router.route('/').post(createMovie).get(getAllMovies)//
router.route('/:id').patch(updateMovie).get(getMovie).delete(deleteMovie)
router.route('/import').post(type, importMovies)
router.route('/import/static').get(importMoviesPage)

module.exports = router