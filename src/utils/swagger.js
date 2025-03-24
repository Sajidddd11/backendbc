const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Todo application',
      contact: {
        name: 'API Support',
        email: 'support@todoapp.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://backendbc.vercel.app' : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 