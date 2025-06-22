import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to TaskFlow</h1>
      {user ? (
        <p className="text-lg">Hello, {user.username}! Manage your tasks or access the admin panel.</p>
      ) : (
        <p className="text-lg">Please <a href="/login" className="text-blue-600">login</a> or <a href="/register" className="text-blue-600">register</a> to manage tasks.</p>
      )}
    </div>
  );
};

export default Dashboard;