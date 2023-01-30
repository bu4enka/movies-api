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

class DuplicateFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateFileError";
  }
}

module.exports = {FileImportError, EmptyFileError, DuplicateFileError};
