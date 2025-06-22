import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserLogs from './UserLogs';
import ConfirmationModal from './ConfirmationModal';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/auth/v1/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/auth/v1/users/${userId}/role`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setUsers(users.map((user) => (user._id === userId ? res.data.user : user)));
      toast.success(`User role updated to ${res.data.user.role}`);
    } catch (error) {
      console.error('Failed to toggle role:', error);
      const message = error.response?.data?.message || 'Failed to toggle role';
      toast.error(message);
      fetchUsers();
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const openModal = (userId, currentRole) => {
    setSelectedUser({ userId, currentRole });
    setModalMessage(`Are you sure you want to make this user ${currentRole === 'admin' ? 'a user' : 'an admin'}?`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalMessage('');
  };

  const confirmToggle = () => {
    if (selectedUser) {
      setLoading(true);
      toggleRole(selectedUser.userId, selectedUser.currentRole);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Manage Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{user.username} ({user.role})</span>
              <button
                onClick={() => openModal(user._id, user.role)}
                className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={loading}
              >
                Make {user.role === 'admin' ? 'User' : 'Admin'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <UserLogs />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmToggle}
        message={modalMessage}
      />
    </div>
  );
};

export default AdminDashboard;