const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Task = require('./model/Task.js');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'supersecretkey';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Replace this with your connection string
const MONGO_URI = 'mongodb+srv://admin:yourpassword123@cluster0.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Auth middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Login (dummy)
app.post('/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// CRUD Routes
app.get('/tasks', verifyToken, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);
  task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
});

app.post('/tasks', verifyToken, async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.put('/tasks/:id', verifyToken, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  updated ? res.json(updated) : res.status(404).json({ message: 'Task not found' });
});

app.delete('/tasks/:id', verifyToken, async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  deleted ? res.json({ message: 'Task deleted' }) : res.status(404).json({ message: 'Task not found' });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
