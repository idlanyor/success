// 404 handler
exports.notFound = (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        message: 'Please check the API documentation at /',
        availableEndpoints: ['/success', '/api/info', '/health'],
        requestedPath: req.path
    });
};

// Global error handler
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(err.status || 500).json({ 
        error: 'Internal server error',
        message: err.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Request logger
exports.logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};

