const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Get absolute paths for route files
const srcDir = path.resolve(__dirname, '..');
const routesPath = path.join(srcDir, 'routes');

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
      },
      schemas: {
        Todo: {
          type: 'object',
          required: ['title', 'deadline'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated id of the todo'
            },
            title: {
              type: 'string',
              description: 'Todo title'
            },
            description: {
              type: 'string',
              description: 'Todo detailed description'
            },
            is_completed: {
              type: 'boolean',
              description: 'Todo completion status',
              default: false
            },
            priority: {
              type: 'integer',
              description: 'Todo priority level (1-10)',
              default: 5
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Todo deadline'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who owns this todo'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Todo creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Todo last update timestamp'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User\'s full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            phone: {
              type: 'string',
              description: 'User\'s phone number'
            },
            username: {
              type: 'string',
              description: 'User\'s username'
            },
            profile_picture: {
              type: 'string',
              description: 'URL to user\'s profile picture'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        TodoStatistics: {
          type: 'object',
          properties: {
            totalTodos: {
              type: 'integer',
              description: 'Total number of todos'
            },
            completedTodos: {
              type: 'integer',
              description: 'Number of completed todos'
            },
            efficiency: {
              type: 'number',
              format: 'float',
              description: 'Completion efficiency percentage'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    // Manually define paths here as a fallback for when automatic scanning doesn't work
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'phone', 'username', 'password'],
                  properties: {
                    name: { type: 'string', description: 'User\'s full name' },
                    email: { type: 'string', format: 'email', description: 'User\'s email' },
                    phone: { type: 'string', description: 'User\'s phone number' },
                    username: { type: 'string', description: 'User\'s username' },
                    password: { type: 'string', format: 'password', description: 'User\'s password' },
                    profile_picture: { type: 'string', description: 'URL to user\'s profile picture' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Bad request - invalid data or username/email already exists' },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Authenticate user and get token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string', description: 'User\'s username' },
                    password: { type: 'string', format: 'password', description: 'User\'s password' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      access_token: { type: 'string', description: 'JWT access token' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid', description: 'User ID' },
                          username: { type: 'string', description: 'User\'s username' },
                          name: { type: 'string', description: 'User\'s full name' },
                          email: { type: 'string', format: 'email', description: 'User\'s email' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/auth/logout': {
        post: {
          summary: 'Logout user (client-side implementation)',
          tags: ['Authentication'],
          description: 'With JWT, logout is typically implemented on the client by removing the token',
          responses: {
            200: {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Logout successful' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/todos': {
        get: {
          summary: 'Get all todos for the authenticated user',
          tags: ['Todos'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of todos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Todo' }
                  }
                }
              }
            },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        },
        post: {
          summary: 'Create a new todo',
          tags: ['Todos'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'deadline'],
                  properties: {
                    title: { type: 'string', description: 'Todo title' },
                    description: { type: 'string', description: 'Todo detailed description' },
                    priority: { type: 'integer', description: 'Todo priority level (1-10)', default: 5 },
                    deadline: { type: 'string', format: 'date-time', description: 'Todo deadline' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Todo created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Todo created successfully' },
                      todo: { $ref: '#/components/schemas/Todo' }
                    }
                  }
                }
              }
            },
            400: { description: 'Invalid input data' },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/todos/{id}': {
        get: {
          summary: 'Get a specific todo by ID',
          tags: ['Todos'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Todo ID'
            }
          ],
          responses: {
            200: {
              description: 'Todo details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Todo' }
                }
              }
            },
            404: { description: 'Todo not found' },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        },
        put: {
          summary: 'Update a todo',
          tags: ['Todos'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Todo ID'
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Todo title' },
                    description: { type: 'string', description: 'Todo detailed description' },
                    is_completed: { type: 'boolean', description: 'Todo completion status' },
                    priority: { type: 'integer', description: 'Todo priority level (1-10)' },
                    deadline: { type: 'string', format: 'date-time', description: 'Todo deadline' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Todo updated successfully' },
            404: { description: 'Todo not found or not owned by the user' },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        },
        delete: {
          summary: 'Delete a todo',
          tags: ['Todos'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Todo ID'
            }
          ],
          responses: {
            200: { description: 'Todo deleted successfully' },
            404: { description: 'Todo not found or not owned by the user' },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/users/profile': {
        get: {
          summary: 'Get user profile and todo statistics',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile with todo statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/UserProfile' },
                      statistics: { $ref: '#/components/schemas/TodoStatistics' }
                    }
                  }
                }
              }
            },
            401: { description: 'Unauthorized - Invalid or missing token' },
            404: { description: 'User not found' },
            500: { description: 'Server error' }
          }
        },
        put: {
          summary: 'Update user profile',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'User\'s full name' },
                    email: { type: 'string', format: 'email', description: 'User\'s email address' },
                    phone: { type: 'string', description: 'User\'s phone number' },
                    profile_picture: { type: 'string', description: 'URL to user\'s profile picture' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Profile updated successfully' },
            400: { description: 'Invalid input or email already in use' },
            401: { description: 'Unauthorized - Invalid or missing token' },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/users/change-password': {
        put: {
          summary: 'Change user password',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string', format: 'password', description: 'Current password' },
                    newPassword: { type: 'string', format: 'password', description: 'New password' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Password changed successfully' },
            400: { description: 'Missing password fields' },
            401: { description: 'Current password is incorrect' },
            404: { description: 'User not found' },
            500: { description: 'Server error' }
          }
        }
      }
    }
  },
  apis: [`${routesPath}/*.js`], // Use absolute path with wildcard
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 