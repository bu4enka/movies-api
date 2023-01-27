class MovieNotFound extends Error {
  constructor(message, id) {
    super(message);
    this.name = "MovieNotFound";
    this.id = id
  }
}

module.exports = MovieNotFound;
