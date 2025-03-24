const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - deadline
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: Todo title
 *         description:
 *           type: string
 *           description: Todo detailed description
 *         is_completed:
 *           type: boolean
 *           description: Todo completion status
 *           default: false
 *         priority:
 *           type: integer
 *           description: Todo priority level (1-10)
 *           default: 5
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Todo deadline
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who owns this todo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Todo creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Todo last update timestamp
 */

// Apply auth middleware to all todo routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/', todoController.getAllTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/:id', todoController.getTodoById);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *                 description: Todo title
 *               description:
 *                 type: string
 *                 description: Todo detailed description
 *               priority:
 *                 type: integer
 *                 description: Todo priority level (1-10)
 *                 default: 5
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Todo deadline
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo created successfully
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post('/', todoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Todo title
 *               description:
 *                 type: string
 *                 description: Todo detailed description
 *               is_completed:
 *                 type: boolean
 *                 description: Todo completion status
 *               priority:
 *                 type: integer
 *                 description: Todo priority level (1-10)
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Todo deadline
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found or not owned by the user
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/:id', todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found or not owned by the user
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 