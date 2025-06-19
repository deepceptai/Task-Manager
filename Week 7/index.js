const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'supersecretkey';

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Dummy data
let tasks = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk, Bread, Eggs',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Finish project',
    description: 'Complete frontend design',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
let idCounter = 3;

// Authentication middleware
function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Missing token' });

  const token = header.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Login route (to generate token)
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username required' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// GET all tasks
app.get('/tasks', verifyToken, (req, res) => {
  res.json(tasks);
});

// GET single task by ID
app.get('/tasks/:id', verifyToken, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// POST new task
app.post('/tasks', verifyToken, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.status(400).json({ message: 'Title and description required' });

  const newTask = {
    id: idCounter++,
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
app.put('/tasks/:id', verifyToken, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, description, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  task.updatedAt = new Date();

  res.json(task);
});

// DELETE task
app.delete('/tasks/:id', verifyToken, (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });

  tasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
