import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">TaskFlow</Link>
        <div className="space-x-4">
          <Link to="/dashboard">Dashboard</Link>
          {user ? (
            <>
              <Link to="/tasks">Tasks</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;