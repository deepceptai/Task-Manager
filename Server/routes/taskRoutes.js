const express = require('express');
const router = express.Router();
const {getTasks,createTask,getTask,updateTask,deleteTaskDirect} = require('../controllers/taskController.js');
const auth = require('../middleware/authMiddleware.js');
const { getUserTask } = require("../middleware/taskMiddleware.js");


// GET /api/tasks - Get all tasks for logged-in user
router.get('/', auth, getTasks);

// POST /api/tasks - Create a new task for logged-in user
router.post('/', auth,createTask);

// GET /api/tasks/:id - Get one task (if it belongs to user)
router.get('/:id', auth, getUserTask,getTask);

// PUT /api/tasks/:id - Update task (if owned by user)
router.put('/:id', auth,getUserTask,updateTask);

// DELETE /api/tasks/:id - Delete task (if owned by user)
router.delete('/:id', auth,getUserTask,deleteTaskDirect);

module.exports = router;
