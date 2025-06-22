import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';

const TaskList = () => {
  const { tasks, fetchTasks, deleteTask } = useContext(TaskContext)
  console.log(tasks);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks(statusFilter, search);
  }, [statusFilter, search]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="flex space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-grow"
        />
        <button
          onClick={() => { setShowForm(true); setSelectedTask(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>
      {showForm && (
        <TaskForm
          task={selectedTask || {}}
          onClose={() => setShowForm(false)}
        />
      )}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => { setSelectedTask(task); setShowForm(true); }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;