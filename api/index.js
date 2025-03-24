require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('../src/routes/auth');
const todoRoutes = require('../src/routes/todos');
const userRoutes = require('../src/routes/users');
const errorHandler = require('../src/middleware/errorHandler');
const { specs, swaggerUi } = require('../src/utils/swagger');

// Debug log for Vercel environment
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  console.log('Current directory:', __dirname);
  console.log('Routes directory:', path.resolve(__dirname, '../src/routes'));
  // Log if route files exist
  const authPath = path.resolve(__dirname, '../src/routes/auth.js');
  console.log('Auth route file exists:', fs.existsSync(authPath));
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Swagger JSON
app.get('/swagger.json', (req, res) => {
  // Include debug info in the response if no paths were found
  if (!specs.paths || Object.keys(specs.paths).length === 0) {
    console.log('No API paths found in Swagger spec');
    return res.status(200).json({
      ...specs,
      debug: {
        message: 'No API paths found in Swagger spec',
        currentDir: __dirname,
        routesDir: path.resolve(__dirname, '../src/routes'),
        filesExist: {
          auth: fs.existsSync(path.resolve(__dirname, '../src/routes/auth.js')),
          todos: fs.existsSync(path.resolve(__dirname, '../src/routes/todos.js')),
          users: fs.existsSync(path.resolve(__dirname, '../src/routes/users.js'))
        }
      }
    });
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Serve Swagger UI
app.get('/api-docs', (req, res) => {
  const htmlPath = path.join(__dirname, 'swagger.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    // Fallback to using swagger-ui-express
    res.send(swaggerUi.generateHTML(specs, { explorer: true }));
  }
});

// The original swagger-ui setup as fallback
app.use('/api-docs', swaggerUi.serve);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Todo API is running',
    documentation: '/api-docs'
  });
});

// Global error handler - must be after routes
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', success: false });
});

// Only start the server if we're not in production (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Export the Express app for Vercel
module.exports = app; 