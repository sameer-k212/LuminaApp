import { useState, useEffect } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(res => {
        setUsers(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteUser = async (id) => {
    if (confirm('Delete this user?')) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">Error: {error}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No users registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{user.username}</h2>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <button 
                  onClick={() => deleteUser(user._id)} 
                  className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
