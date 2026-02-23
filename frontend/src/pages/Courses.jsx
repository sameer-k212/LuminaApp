import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    api('/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const deleteCourse = async (id) => {
    await api(`/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-14 sm:mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Courses</h1>
        {role === 'admin' && (
          <Link to="/create" className="px-3 sm:px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition text-sm sm:text-base w-full sm:w-auto text-center">
            + New Course
          </Link>
        )}
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No courses yet. Create your first course!</p>
          <Link to="/create" className="text-blue-600 dark:text-blue-400 hover:underline">+ Create Course</Link>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {courses.map(course => (
            <div key={course._id} className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-start">
                <a href={`/courses/${course._id}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-sm text-gray-500">{course.chapters?.length || 0} chapters</p>
                </a>
                {role === 'admin' && (
                  <button onClick={() => deleteCourse(course._id)} className="px-2 sm:px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition text-sm sm:text-base">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
