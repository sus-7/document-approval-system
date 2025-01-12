const errorHandler = (error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: false,
        message: error.message,
    });
};

module.exports = errorHandler;
