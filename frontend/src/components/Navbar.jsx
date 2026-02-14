import { Link } from 'react-router-dom';

export default function Navbar({ darkMode, toggleDarkMode, onLogout }) {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleToggle = () => {
    console.log('Toggle clicked, current mode:', darkMode);
    console.log('HTML classes before:', document.documentElement.className);
    toggleDarkMode();
    setTimeout(() => {
      console.log('HTML classes after:', document.documentElement.className);
    }, 100);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Link to="/" className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">Home</Link>
          <Link to="/courses" className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">Courses</Link>
          {role === 'admin' && (
            <>
              <Link to="/create" className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">Create</Link>
              <Link to="/users" className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">Users</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">{username} ({role})</span>
          <button 
            onClick={handleToggle} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            type="button"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onLogout} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Logout</button>
        </div>
      </div>
    </nav>
  );
}
