const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'supersecretkey';

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB Connection (direct URI without .env)
mongoose.connect('mongodb+srv://venkateshrayudu10:Vrayudu@cluster0.0cjxxg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// MongoDB Models
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false }
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Username taken or invalid' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Task Routes (Protected)
app.get('/tasks', authMiddleware, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
});

app.post('/tasks', authMiddleware, async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  updated ? res.json(updated) : res.status(404).json({ message: 'Task not found' });
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  deleted ? res.json({ message: 'Task deleted' }) : res.status(404).json({ message: 'Task not found' });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
