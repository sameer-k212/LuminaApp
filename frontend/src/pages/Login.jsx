import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Hardcoded admin login
      if (loginType === 'admin') {
        if (username === 'admin' && password === 'admin123') {
          const token = 'hardcoded-admin-token';
          localStorage.setItem('token', token);
          localStorage.setItem('role', 'admin');
          localStorage.setItem('username', 'admin');
          onLogin();
          navigate('/courses');
        } else {
          setError('Invalid admin credentials');
        }
        return;
      }
      
      // User login/register
      const endpoint = isRegister ? '/api/register' : '/api/login';
      const res = await axios.post(`http://localhost:5000${endpoint}`, { username, password });
      
      if (isRegister) {
        setIsRegister(false);
        setPassword('');
        alert('Registration successful! Please login.');
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.username);
        onLogin();
        navigate('/courses');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        
        {/* Login Type Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`flex-1 py-2 rounded-lg transition ${
              loginType === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 rounded-lg transition ${
              loginType === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Admin
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loginType === 'admin' ? 'Login as Admin' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        {loginType === 'user' && (
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        )}
        {loginType === 'admin' && (
          <p className="mt-4 text-xs text-center text-gray-500">
            Admin credentials: username: admin, password: admin123
          </p>
        )}
      </div>
    </div>
  );
}
