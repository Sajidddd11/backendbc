require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('../src/routes/auth');
const todoRoutes = require('../src/routes/todos');
const userRoutes = require('../src/routes/users');
const errorHandler = require('../src/middleware/errorHandler');
const { specs, swaggerUi } = require('../src/utils/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

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