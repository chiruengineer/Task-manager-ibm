import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
      setError("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tasks", { title: newTask });
      setNewTask("");
      setError("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
      </header>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Input Field */}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <span onClick={() => toggleTask(task.id, task.completed)}>
              {task.title}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;