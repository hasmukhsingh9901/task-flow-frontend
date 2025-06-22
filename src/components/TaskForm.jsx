import React, { useState } from 'react';
import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

const TaskForm = ({ task = {}, onClose }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'incomplete');
  const { createTask, updateTask } = useContext(TaskContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, status };
    if (task._id) {
      await updateTask(task._id, taskData);
    } else {
      await createTask(taskData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">{task._id ? 'Edit Task' : 'Create Task'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="incomplete">Incomplete</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {task._id ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;