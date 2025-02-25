const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Use UUID for unique task IDs
const app = express();
const port = 5000;

// Sample in-memory database
let tasks = [
  { id: uuidv4(), title: 'Complete project proposal', completed: false },
  { id: uuidv4(), title: 'Schedule team meeting', completed: true },
];

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Add a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: uuidv4(), // Generate a unique ID
    title,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task's completion status
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = completed;
  res.json(task);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
