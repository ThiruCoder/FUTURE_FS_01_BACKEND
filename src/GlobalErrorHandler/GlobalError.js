

const GlobalError = (err, req, res, next) => {
    const status = err.statusCode || 500;

    const errorMessage =
        status === 500
            ? 'Internal server error'
            : err.message || 'An error occurred';

    if (process.env.NODE_ENV !== 'production') {
        console.error('Global Error:', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            error: err,
        });
    }

    res.status(status).json({
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV !== 'production' && { error: err }),
    });
};

export { GlobalError };
