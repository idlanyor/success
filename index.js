const express = require('express');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/config');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { notFound, errorHandler, logger } = require('./middleware/errorHandler');

const app = express();
const PORT = config.port;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Success Card API Documentation',
    customfavIcon: 'https://files.catbox.moe/vws5b2.jpg'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Routes
app.use('/', routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Success Card API Server');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`📝 API Info (JSON): http://localhost:${PORT}/`);
    console.log(`🎨 Generate card: http://localhost:${PORT}/success`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(60));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    process.exit(0);
});

module.exports = app;
