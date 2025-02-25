import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from the backend API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask) return;
    try {
      const response = await axios.post('/api/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Update task status (completed)
  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await axios.put(`/api/tasks/${taskId}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Run fetchTasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <input 
        type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add Task</button>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id}>
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTaskCompletion(task.id)} 
              />
              {task.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
