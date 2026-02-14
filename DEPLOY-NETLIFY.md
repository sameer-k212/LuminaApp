# Deploy to Netlify (Full-Stack)

## 🚀 One-Click Deployment

### Step 1: Push to GitHub
```bash
cd d:\CODE\My-Courses
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Netlify auto-detects `netlify.toml` settings
5. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=djrmtxrx5
   CLOUDINARY_API_KEY=574869673579758
   CLOUDINARY_API_SECRET=eiwp9KkKXnAxtbkSIf9n6GXkaog
   ```
6. Click "Deploy"

### Step 3: Done! ✅
Your app is live at: `https://your-app.netlify.app`

## 📝 What Happens:
- Frontend builds from `/frontend`
- Backend runs as Netlify Function
- API routes: `/api/*` → serverless backend
- Frontend routes: `/*` → React app

## 🔧 Local Development:
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## ✅ Features:
- ✅ Full-stack on single domain
- ✅ No CORS issues
- ✅ Auto-scaling
- ✅ Free SSL
- ✅ CDN included
- ✅ Serverless backend
