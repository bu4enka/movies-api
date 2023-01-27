class ActorNameError extends Error {
  constructor(message, actor) {
    super(message);
    this.name = "ActorNameValidation";
    this.actor = actor
  }
}

module.exports = ActorNameError;
