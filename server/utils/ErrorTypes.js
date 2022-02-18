class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message || "";
    const [statusCode, statusMessage] = this.getStatus();
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }

  getStatus() {
    if (this instanceof BadRequestError) return [400, "Bad request."];
    else if (this instanceof ForbiddenError) return [403, "Forbidden"];
    else if (this instanceof NotFoundError) return [404, "Not found"];
    else return [500, "Internal server error"];
  }
}

class BadRequestError extends GeneralError {}
class ForbiddenError extends GeneralError {}
class NotFoundError extends GeneralError {}

module.exports = {
  GeneralError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
};
