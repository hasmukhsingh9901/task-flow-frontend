import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole } from '../store/slices/userSlice';
import { toast } from 'react-toastify';
import UserLogs from './UserLogs';
import ConfirmationModal from './ConfirmationModal';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const toggleRole = async (userId, currentRole) => {
    try {
      const result = await dispatch(updateUserRole(userId));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`User role updated to ${result.payload.role}`);
      }
    } catch (error) {
      toast.error('Failed to toggle role');
    } finally {
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
      toggleRole(selectedUser.userId, selectedUser.currentRole);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Manage Users</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="text-xl">Loading users...</div>
          </div>
        ) : (
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
        )}
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