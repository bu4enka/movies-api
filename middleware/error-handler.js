const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    status: 0,
    error: {
      fields: {}
    },
    code: "VALIDATION_FAILED"
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const isConstraint = err.name === 'SequelizeUniqueConstraintError' ? true : false
    err.errors.map(x => {
      customError.error.fields = { ...customError.error.fields, [x.path]: isConstraint ? x.validatorKey.toUpperCase() : x.message }
    })
    return res.status(400).json(customError)
  }

  if (err.name === 'ActorNameValidation') {
    customError.error.fields = { ...customError.error.fields, name: err.actor }
    return res.status(400).json(customError)
  }

  if (err.name === 'FileImportError') {
    customError.error.fields = { file: "FILE_EXT_NOT_VALID" }
    customError.code = { file: "FILE_EXT_NOT_VALID" }
    return res.status(400).json(customError)
  }

  if (err.name === 'EmptyFileError') {
    customError.error.fields = { file: "FILE_IS_EMPTY" }
    customError.code = "FILE_IS_EMPTY"
    return res.status(400).json(customError)
  }

  if (err.name === 'MovieNotFound') {
    customError.error.fields = { id: err.id }
    customError.code = err.message
    return res.status(404).json(customError)
  }

  return res.status(500).json(err)
}

module.exports = errorHandlerMiddleware
