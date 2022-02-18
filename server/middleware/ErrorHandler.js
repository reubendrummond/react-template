class ErrorHandler {
  logError = (err, req, res, next) => {
    console.error(err)
    next(err);
  };

  sendError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const {message, statusMessage} = err;
    
    const errorObj = {};
    Object.getOwnPropertyNames(err).forEach((key) => {
      errorObj[key] = err[key];
    });

    res.status(statusCode).json({
      statusCode,
      statusMessage,
      message,
    });
  };

  invalidPath = (req, res, next) => {
    res.status(404).send("Invalid path.");
  };
}

module.exports = new ErrorHandler()