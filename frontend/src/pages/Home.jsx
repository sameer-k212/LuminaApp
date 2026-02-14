import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
      <h1 className="text-4xl font-bold mb-4">My Learning Platform</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
        A simple reading platform to organize and study your course materials.
      </p>
      <Link to="/courses" className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition">
        View Courses
      </Link>
    </div>
  );
}
