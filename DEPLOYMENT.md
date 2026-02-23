# LuminaApp - Vercel Deployment Guide

## 🚀 Quick Deploy

### 1. Backend Deployment

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set **Root Directory** to `backend`
5. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://sameerkushwaha2003_db_user:0HWr4SrYFW0c2u3i@cluster0.aefzmck.mongodb.net/lumina
   JWT_SECRET=your_strong_secret_key_here
   CLOUDINARY_CLOUD_NAME=dyi8bii5f
   CLOUDINARY_API_KEY=369693991515352
   CLOUDINARY_API_SECRET=7K1HTYQXJg6QCDyu1Dhdzy0MwOs
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Deploy

### 2. Frontend Deployment

1. Create another Vercel project
2. Set **Root Directory** to `frontend`
3. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
4. Deploy

### 3. Update CORS

After deployment, update backend `FRONTEND_URL` with actual frontend URL.

## 📝 Production Checklist

- ✅ Change JWT_SECRET to strong random string
- ✅ Update FRONTEND_URL in backend env
- ✅ Update VITE_API_URL in frontend env
- ✅ Test login/signup
- ✅ Test course creation
- ✅ Test image upload

## 🔒 Security Notes

- Never commit `.env` files
- Use strong JWT secret in production
- MongoDB credentials are already set
- Cloudinary credentials are configured

## 🌐 URLs After Deployment

- Backend: `https://your-backend.vercel.app`
- Frontend: `https://your-frontend.vercel.app`

## 🛠️ Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## 📦 Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Storage: Cloudinary
- Deployment: Vercel
