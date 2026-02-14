# My Learning Platform

A minimal MERN stack reading platform for organizing course materials with dark/light mode.

## Features
- Create courses with chapters and subheadings
- Add points, paragraphs, and images to each section
- Dark/Light mode toggle
- Clean, minimal UI with Tailwind CSS
- Faded background effect for paragraphs

## Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Start MongoDB
Ensure MongoDB is running on `localhost:27017`

### 3. Start Backend Server
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## Usage
1. Click "Courses" in navbar
2. Click "+ New Course" to create a course
3. Add chapters, subheadings, points, paragraphs, and images
4. Save and view your course
5. Toggle dark/light mode with the moon/sun icon

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Express.js, MongoDB, Mongoose, Multer
- **Database**: MongoDB
