import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/courses')
      .then(res => {
        setCourses(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const deleteCourse = async (id) => {
    if (confirm('Delete this course?')) {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        {role === 'admin' && (
          <Link to="/create" className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition">
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
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course._id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="flex justify-between items-start">
                <a href={`/courses/${course._id}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-sm text-gray-500">{course.chapters?.length || 0} chapters</p>
                </a>
                {role === 'admin' && (
                  <button onClick={() => deleteCourse(course._id)} className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
