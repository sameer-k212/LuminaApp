# My-Courses Deployment Guide

## 🚀 Quick Deploy

### Backend (Vercel/Render)
1. Push code to GitHub
2. Connect to Vercel/Render
3. Add environment variables
4. Deploy

### Frontend (Netlify)
1. Push code to GitHub
2. Connect to Netlify
3. Add environment variable
4. Deploy

---

## 📦 Backend Deployment (Vercel)

### Step 1: Prepare Backend
```bash
cd backend
npm install
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select `backend` folder as root directory
5. Add Environment Variables:
   - `MONGO_URI` = your_mongodb_connection_string
   - `JWT_SECRET` = your_secure_jwt_secret
   - `CLOUDINARY_CLOUD_NAME` = djrmtxrx5
   - `CLOUDINARY_API_KEY` = 574869673579758
   - `CLOUDINARY_API_SECRET` = eiwp9KkKXnAxtbkSIf9n6GXkaog
6. Click "Deploy"
7. Copy your backend URL (e.g., https://your-app.vercel.app)

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Update API URL
Edit `frontend/.env`:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Step 2: Build Test
```bash
cd frontend
npm install
npm run build
```

### Step 3: Deploy to Netlify
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL` = https://your-backend-url.vercel.app/api
7. Click "Deploy"

---

## 🔧 Alternative: Backend on Render

### Deploy to Render
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: my-courses-backend
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (same as Vercel)
6. Click "Create Web Service"

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running (test: https://your-backend.vercel.app/api/courses)
- [ ] Frontend is deployed (test: https://your-app.netlify.app)
- [ ] Environment variables are set correctly
- [ ] CORS is configured (backend allows frontend domain)
- [ ] MongoDB connection is working
- [ ] Cloudinary uploads work
- [ ] Login/Register works
- [ ] Image upload works

---

## 🔒 Security Notes

- ✅ `.env` files are in `.gitignore`
- ✅ No hardcoded secrets in code
- ✅ JWT secret is secure
- ✅ MongoDB credentials are protected

---

## 🐛 Troubleshooting

### CORS Error
Add to `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend.netlify.app',
  credentials: true
}));
```

### API Not Found
Check `VITE_API_URL` in Netlify environment variables

### MongoDB Connection Failed
Verify `MONGO_URI` in Vercel/Render environment variables

### Images Not Uploading
Check Cloudinary credentials in backend environment variables

---

## 📝 Environment Variables Summary

### Backend (Vercel/Render)
```
MONGO_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=djrmtxrx5
CLOUDINARY_API_KEY=574869673579758
CLOUDINARY_API_SECRET=eiwp9KkKXnAxtbkSIf9n6GXkaog
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.vercel.app/api
```
