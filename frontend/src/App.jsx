import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoadingSkeleton from './components/LoadingSkeleton';

const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseView = lazy(() => import('./pages/CourseView'));
const CreateCourse = lazy(() => import('./pages/CreateCourse'));
const Login = lazy(() => import('./pages/Login'));
const Users = lazy(() => import('./pages/Users'));

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-x-hidden">
        {isAuthenticated && window.location.pathname !== '/courses/' && !window.location.pathname.startsWith('/courses/') && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />}
        <Toast />
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <LoadingSkeleton />
          </div>
        }>
          <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/courses" />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/courses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
          <Route path="/courses/:id" element={isAuthenticated ? <CourseView /> : <Navigate to="/login" />} />
          <Route path="/create" element={isAuthenticated ? <CreateCourse /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
