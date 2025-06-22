import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { refreshAccessToken } = useContext(AuthContext);

  const fetchTasks = async (status = '', search = '') => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/tasks`, { params: { status, search } });
      setTasks(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          await fetchTasks(status, search);
        }
      } else {
        console.error('Failed to fetch tasks:', error);
      }
    }
  };

  const createTask = async (taskData) => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/tasks', taskData);
      setTasks([...tasks, res.data.task]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/tasks/${taskId}`, taskData);
      setTasks(tasks.map((task) => (task._id === taskId ? res.data.task : task)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };