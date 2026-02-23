import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import HighlightableText from '../components/HighlightableText';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

export default function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imageCache, setImageCache] = useState({});
  const role = localStorage.getItem('role');
  const toast = useToast();

  useEffect(() => {
    api(`/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setEditData(data);
      })
      .catch(() => {});
  }, [id]);

  const addSubheading = (chIdx) => {
    const newData = { ...editData };
    newData.chapters[chIdx].subheadings.push({ title: '', points: [''], paragraph: '', image: '' });
    setEditData(newData);
  };

  const addChapter = () => {
    const newData = { ...editData };
    newData.chapters.push({ heading: '', subheadings: [{ title: '', points: [''], paragraph: '', image: '' }] });
    setEditData(newData);
  };

  const updateChapter = (chIdx, field, value) => {
    const newData = { ...editData };
    newData.chapters[chIdx][field] = value;
    setEditData(newData);
  };

  const updateSubheading = (chIdx, subIdx, field, value) => {
    const newData = { ...editData };
    newData.chapters[chIdx].subheadings[subIdx][field] = value;
    setEditData(newData);
  };

  const updatePoint = (chIdx, subIdx, pIdx, value) => {
    const newData = { ...editData };
    newData.chapters[chIdx].subheadings[subIdx].points[pIdx] = value;
    setEditData(newData);
  };

  const addPoint = (chIdx, subIdx) => {
    const newData = { ...editData };
    newData.chapters[chIdx].subheadings[subIdx].points.push('');
    setEditData(newData);
  };

  const removeImage = async (chIdx, subIdx, imageUrl) => {
    if (!imageUrl) return;
    try {
      if (imageUrl.includes('cloudinary.com')) {
        await api('/delete-image', { method: 'DELETE', body: JSON.stringify({ url: imageUrl }) });
      }
      updateSubheading(chIdx, subIdx, 'image', '');
    } catch (error) {
      updateSubheading(chIdx, subIdx, 'image', '');
    }
  };

  const uploadImage = async (chIdx, subIdx, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api('/upload', { method: 'POST', body: formData, headers: {} });
      const data = await res.json();
      updateSubheading(chIdx, subIdx, 'image', data.url);
      setImageCache({ ...imageCache, [`${chIdx}-${subIdx}`]: data.url });
      setUploading(false);
      toast('Image uploaded! Now click Save.', 'success');
    } catch (error) {
      setUploading(false);
      toast('Failed to upload: ' + error.message, 'error');
    }
  };

  const saveChanges = async () => {
    if (uploading) {
      toast('Please wait for image upload to complete!', 'info');
      return;
    }
    try {
      const res = await api(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(editData) });
      const data = await res.json();
      setCourse(data);
      setEditData(data);
      setEditMode(false);
      setSelectedChapter(0);
      toast('Changes saved successfully!', 'success');
    } catch (error) {
      toast('Failed to save: ' + error.message, 'error');
    }
  };

  const cancelEdit = () => {
    setEditData(course);
    setEditMode(false);
  };

  if (!course) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <LoadingSkeleton />
    </div>
  );

  const data = editMode ? editData : course;
  const currentChapter = data.chapters?.[selectedChapter];

  return (
    <div className="flex max-w-full min-h-screen flex-col lg:flex-row">
      {/* Sidebar - Fixed on desktop, collapsible on mobile */}
      <div className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 border-gray-200 dark:border-gray-700 lg:h-screen p-4 lg:fixed lg:left-0 lg:top-0 overflow-y-auto bg-gray-50 dark:bg-gray-800 scrollbar-hide">
        <div className="lg:mt-4">
          <button onClick={() => navigate('/courses')} className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Courses
          </button>
          <h3 className="font-bold mb-4 text-sm text-gray-500 uppercase">Chapters</h3>
          <div className="space-y-2 flex lg:flex-col flex-row overflow-x-auto lg:overflow-x-visible gap-2">
            {data.chapters?.map((ch, i) => (
              <button
                key={i}
                onClick={() => setSelectedChapter(i)}
                className={`w-full lg:w-auto min-w-[120px] lg:min-w-0 text-left p-3 rounded-lg transition ${
                  selectedChapter === i
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-medium truncate">{ch.heading || `Chapter ${i + 1}`}</div>
                <div className="text-xs text-gray-500 mt-1">{ch.subheadings?.length || 0} sections</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 lg:ml-64 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Course Title"
                className="text-4xl sm:text-5xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold">{data.title}</h1>
            )}
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0 flex-wrap">
            {editMode ? (
              <>
                <button onClick={saveChanges} disabled={uploading} className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
                <button onClick={cancelEdit} className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base">Cancel</button>
              </>
            ) : (
              role === 'admin' && <button onClick={() => setEditMode(true)} className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">Edit</button>
            )}
          </div>
        </div>

        {currentChapter && (
          <div className="mb-12 animate-fade-in bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 sm:p-8" key={selectedChapter}>
            {editMode ? (
              <input
                type="text"
                value={currentChapter.heading}
                onChange={(e) => updateChapter(selectedChapter, 'heading', e.target.value)}
                placeholder="Chapter Heading"
                className="text-xl sm:text-2xl font-bold mb-6 w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 pb-2"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold mb-8 pb-3 border-b-2 border-gray-200 dark:border-gray-700">{currentChapter.heading}</h2>
            )}
            {currentChapter.subheadings?.map((sub, j) => {
              if (!editMode && !sub.title?.trim() && !sub.paragraph?.trim() && !sub.points?.some(p => p.trim()) && !sub.image) return null;
              return (
              <div key={j} className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {sub.title?.trim() && (
                  editMode ? (
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => updateSubheading(selectedChapter, j, 'title', e.target.value)}
                      placeholder="Subheading Title"
                      className="text-xl sm:text-2xl font-semibold mb-4 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{sub.title}</h3>
                  )
                )}
                {editMode && !sub.title?.trim() && (
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => updateSubheading(selectedChapter, j, 'title', e.target.value)}
                    placeholder="Subheading Title"
                    className="text-xl sm:text-2xl font-semibold mb-4 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                )}
                {sub.points?.length > 0 && sub.points.some(p => p.trim()) && (
                  <ul className="list-none mb-6 space-y-3 pl-0">
                    {sub.points.filter(p => p.trim()).map((point, k) => (
                      <li key={k} className="flex items-start text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => updatePoint(selectedChapter, j, k, e.target.value)}
                            placeholder="Point"
                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 flex-1"
                          />
                        ) : (
                          <span className="flex-1">{point}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {editMode && <button onClick={() => addPoint(selectedChapter, j)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">+ Add Point</button>}
                {(sub.paragraph || editMode) && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    {editMode ? (
                      <textarea
                        value={sub.paragraph || ''}
                        onChange={(e) => updateSubheading(selectedChapter, j, 'paragraph', e.target.value)}
                        placeholder="Write paragraph here..."
                        className="w-full bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none text-gray-800 dark:text-gray-200"
                        rows="4"
                      />
                    ) : (
                      <div className="leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-base">
                        <HighlightableText text={sub.paragraph} courseId={id} field={`ch${selectedChapter}_sub${j}_para`} />
                      </div>
                    )}
                  </div>
                )}
                {editMode && !sub.paragraph && (
                  <button onClick={() => updateSubheading(selectedChapter, j, 'paragraph', '')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">+ Add Paragraph</button>
                )}
                {sub.image && (
                  <div className="my-6">
                    <img 
                      src={sub.image} 
                      alt={sub.title || 'Course image'} 
                      className="max-w-full rounded-xl shadow-lg transition-opacity duration-300 border border-gray-200 dark:border-gray-700" 
                      loading="lazy"
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  </div>
                )}
                {editMode && (
                  <div className="mt-3 space-y-2">
                    {sub.image && (
                      <div className="mb-2">
                        <img 
                          src={sub.image} 
                          alt="Preview" 
                          className="max-w-xs rounded border transition-opacity duration-300" 
                          loading="lazy"
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        <button 
                          onClick={() => removeImage(selectedChapter, j, sub.image)}
                          className="text-xs text-red-600 hover:underline mt-1 block"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && uploadImage(selectedChapter, j, e.target.files[0])}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 file:cursor-pointer"
                    />
                    <div className="text-sm text-gray-500">or</div>
                    <input
                      type="text"
                      placeholder="Paste image URL"
                      defaultValue={sub.image}
                      onBlur={(e) => e.target.value && updateSubheading(selectedChapter, j, 'image', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                )}
              </div>
              );
            })}
            {editMode && (
              <div className="mt-6">
                <button onClick={() => addSubheading(selectedChapter)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Add Subheading</button>
              </div>
            )}
          </div>
        )}
        {editMode && (
          <div className="mt-8 mb-6">
            <button onClick={addChapter} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">+ Add Chapter</button>
          </div>
        )}

        {/* Navigation Buttons - Fixed Right */}
        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 flex flex-col gap-2 sm:gap-4 z-50">
          <button
            onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
            disabled={selectedChapter === 0}
            className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-gray-200 dark:border-gray-600 text-lg sm:text-xl"
          >
            ↑
          </button>
          <button
            onClick={() => setSelectedChapter(Math.min(data.chapters.length - 1, selectedChapter + 1))}
            disabled={selectedChapter === data.chapters.length - 1}
            className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-gray-200 dark:border-gray-600 text-lg sm:text-xl"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
