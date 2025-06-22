import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/v1/user-logs');
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await axios.delete(`http://localhost:8000/auth/v1/user-logs/${logId}`);
        setLogs(logs.filter((log) => log._id !== logId));
      } catch (error) {
        console.error('Failed to delete log:', error);
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">User Logs</h3>
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
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLogs;