import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLogs, deleteUserLog } from '../store/slices/userSlice';
import { toast } from 'react-toastify';

const UserLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserLogs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      const result = await dispatch(deleteUserLog(logId));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Log deleted successfully');
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">User Logs</h3>
      {loading ? (
        <div className="text-center py-8">
          <div className="text-xl">Loading logs...</div>
        </div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Login Time</th>
              <th className="p-2">Logout Time</th>
              <th className="p-2">Token Name</th>
              <th className="p-2">IP Address</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-2">{log.username}</td>
                <td className="p-2">{log.role}</td>
                <td className="p-2">{new Date(log.loginTime).toLocaleString()}</td>
                <td className="p-2">{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : '-'}</td>
                <td className="p-2">{log.tokenName}</td>
                <td className="p-2">{log.ipAddress}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserLogs;