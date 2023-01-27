class FileImportError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileImportError";
  }
}

class EmptyFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmptyFileError";
  }
}

module.exports = {FileImportError, EmptyFileError};
