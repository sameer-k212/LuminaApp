const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const compression = require('compression');
require('dotenv').config();

const app = express();

app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const User = mongoose.model('User', UserSchema);

const HighlightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  text: { type: String, required: true },
  startOffset: { type: Number, required: true },
  endOffset: { type: Number, required: true },
  color: { type: String, default: '#ffeb3b' },
  field: { type: String, required: true }
}, { timestamps: true });

const Highlight = mongoose.model('Highlight', HighlightSchema);

const CourseSchema = new mongoose.Schema({
  title: String,
  chapters: [{
    heading: String,
    subheadings: [{
      title: String,
      points: [String],
      paragraph: String,
      image: String
    }]
  }]
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  // Handle hardcoded admin token
  if (token === 'hardcoded-admin-token') {
    req.user = { id: 'admin', role: 'admin' };
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role: 'user' });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/api/create-admin', async (req, res) => {
  const { username, password, secret } = req.body;
  if (secret !== 'admin123') return res.status(403).json({ message: 'Invalid secret' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({ username, password: hashedPassword, role: 'admin' });
  await admin.save();
  res.json({ message: 'Admin created' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, role: user.role, username: user.username });
});

app.get('/api/courses', authMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.get('/api/courses/:id', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

app.post('/api/courses', authMiddleware, adminMiddleware, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
});

app.put('/api/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, returnDocument: 'after' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.post('/api/upload', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'my-courses' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/delete-image', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes('cloudinary.com')) {
      return res.json({ message: 'Not a Cloudinary image' });
    }
    
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const publicId = `my-courses/${filename}`;
    
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

app.post('/api/highlights', authMiddleware, async (req, res) => {
  try {
    const { courseId, text, startOffset, endOffset, color, field } = req.body;
    const highlight = new Highlight({
      userId: req.user.id,
      courseId,
      text,
      startOffset,
      endOffset,
      color,
      field
    });
    await highlight.save();
    res.json(highlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/highlights/:courseId', authMiddleware, async (req, res) => {
  try {
    const highlights = await Highlight.find({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/highlights/:id', authMiddleware, async (req, res) => {
  try {
    await Highlight.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Highlight deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
