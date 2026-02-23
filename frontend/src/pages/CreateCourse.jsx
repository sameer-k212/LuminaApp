import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [chapters, setChapters] = useState([{ heading: '', subheadings: [{ title: '', points: [''], paragraph: '', image: '' }] }]);

  const addChapter = () => setChapters([...chapters, { heading: '', subheadings: [{ title: '', points: [''], paragraph: '', image: '' }] }]);
  
  const addSubheading = (chIdx) => {
    const newChapters = [...chapters];
    newChapters[chIdx].subheadings.push({ title: '', points: [''], paragraph: '', image: '' });
    setChapters(newChapters);
  };

  const addPoint = (chIdx, subIdx) => {
    const newChapters = [...chapters];
    newChapters[chIdx].subheadings[subIdx].points.push('');
    setChapters(newChapters);
  };

  const updateChapter = (chIdx, field, value) => {
    const newChapters = [...chapters];
    newChapters[chIdx][field] = value;
    setChapters(newChapters);
  };

  const updateSubheading = (chIdx, subIdx, field, value) => {
    const newChapters = [...chapters];
    newChapters[chIdx].subheadings[subIdx][field] = value;
    setChapters(newChapters);
  };

  const updatePoint = (chIdx, subIdx, pIdx, value) => {
    const newChapters = [...chapters];
    newChapters[chIdx].subheadings[subIdx].points[pIdx] = value;
    setChapters(newChapters);
  };

  const uploadImage = async (chIdx, subIdx, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api('/upload', { method: 'POST', body: formData, headers: {} });
    const data = await res.json();
    updateSubheading(chIdx, subIdx, 'image', data.url);
  };

  const saveCourse = async () => {
    await api('/courses', { method: 'POST', body: JSON.stringify({ title, chapters }) });
    navigate('/courses');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Create Course</h1>
      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {chapters.map((ch, chIdx) => (
        <div key={chIdx} className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="Chapter Heading"
            value={ch.heading}
            onChange={(e) => updateChapter(chIdx, 'heading', e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {ch.subheadings.map((sub, subIdx) => (
            <div key={subIdx} className="ml-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="text"
                placeholder="Subheading Title"
                value={sub.title}
                onChange={(e) => updateSubheading(chIdx, subIdx, 'title', e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {sub.points.map((point, pIdx) => (
                <input
                  key={pIdx}
                  type="text"
                  placeholder="Point"
                  value={point}
                  onChange={(e) => updatePoint(chIdx, subIdx, pIdx, e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ))}
              <button onClick={() => addPoint(chIdx, subIdx)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2">+ Add Point</button>
              <textarea
                placeholder="Paragraph"
                value={sub.paragraph}
                onChange={(e) => updateSubheading(chIdx, subIdx, 'paragraph', e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows="3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(chIdx, subIdx, e.target.files[0])}
                className="mb-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 file:cursor-pointer"
              />
              <div className="text-xs text-gray-500 mb-2">or paste image URL:</div>
              <input
                type="text"
                placeholder="Image URL"
                onBlur={(e) => e.target.value && updateSubheading(chIdx, subIdx, 'image', e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 text-sm"
              />
              {sub.image && <img src={sub.image} alt="preview" className="w-32 h-32 object-cover rounded-lg shadow-sm" />}
            </div>
          ))}
          <button onClick={() => addSubheading(chIdx)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Add Subheading</button>
        </div>
      ))}
      <button onClick={addChapter} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition mr-2">+ Add Chapter</button>
      <button onClick={saveCourse} className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition">Save Course</button>
    </div>
  );
}
