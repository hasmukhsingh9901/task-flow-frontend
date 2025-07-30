import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../store/slices/taskSlice';
import { toast } from 'react-toastify';

const TaskForm = ({ task = {}, onClose }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'incomplete');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, status };
    
    try {
      if (task._id) {
        await dispatch(updateTask({ taskId: task._id, taskData }));
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(taskData));
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save task');
    }
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
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="incomplete">Incomplete</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : (task._id ? 'Update' : 'Create')}
        </button>
        <button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;