const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Determine API paths based on environment
const apiPaths = process.env.NODE_ENV === 'production' 
  ? ['../routes/*.js'] 
  : ['./src/routes/*.js'];

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
        url: 'https://backendbc.vercel.app',
        description: 'Production Server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
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
  apis: apiPaths,
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 