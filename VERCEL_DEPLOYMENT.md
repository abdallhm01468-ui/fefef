# 🚀 Vercel Deployment Guide

## الخطوة 1: تجهيز الـ GitHub Repository

```bash
# أضف المشروع إلى Git
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push origin main
```

## الخطوة 2: Deploy على Vercel

### Option A: باستخدام Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# Deploy المشروع
vercel
```

### Option B: باستخدام Vercel Dashboard

1. اذهب إلى https://vercel.com
2. اضغط على "New Project"
3. اختر GitHub repository (فefe)
4. اضغط على "Import"

## الخطوة 3: تعيين Environment Variables

في Vercel Dashboard:

1. اذهب إلى Project Settings → Environment Variables
2. أضف المتغيرات التالية:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
DB_NAME = eduflow
GEMINI_API_KEY = AIzaSyBWj1xrzaqxc2EtQXVocyFIrJhaLq2RjbI
ALLOWED_ORIGINS = https://yourdomain.vercel.app
NODE_ENV = production
```

## الخطوة 4: تحديث VITE_API_URL (إذا لزم الأمر)

الـ Frontend سيستخدم `/api` (نفس الـ domain)، لكن إذا كنت تستخدم subdomain:

```env
VITE_API_URL=https://yourdomain.vercel.app/api
```

## الخطوة 5: تحقق من الـ Build

بعد الـ Push:

```
Vercel will automatically:
✅ Build your frontend (Vite)
✅ Deploy serverless functions in /api
✅ Set up HTTPS
✅ Configure CORS
```

## الهيكل النهائي على Vercel:

```
yourdomain.vercel.app/
├── / (Frontend - React)
├── /api/summaries (GET, POST, PUT, DELETE)
├── /api/videos (GET, POST, PUT, DELETE)
├── /api/lives (GET, POST, PUT, DELETE)
├── /api/exams (GET, POST, PUT, DELETE)
└── /api/chat (POST)
```

## Testing الـ API:

```bash
# Get all summaries
curl https://yourdomain.vercel.app/api/summaries

# Create summary
curl -X POST https://yourdomain.vercel.app/api/summaries \
  -H "Content-Type: application/json" \
  -d '{"id":"123", "title":"Chapter 1", "titleAr":"الفصل 1", "description":"...", "fileUrl":"...", "subjectCode":"ACCT150"}'

# Chat API
curl -X POST https://yourdomain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'
```

## الـ URL بعد الـ Deploy:

- **Frontend**: `https://yourdomain.vercel.app`
- **API Endpoints**: `https://yourdomain.vercel.app/api/*`

---

## الفوائد:

✅ No backend server to manage
✅ Auto-scaling
✅ HTTPS by default
✅ Global CDN
✅ Serverless (pay per use)
✅ Zero cold starts with Vercel Edge Functions

## المشاكل الشائعة وحلولها:

### 1. 404 on API endpoints
- تأكد أن الـ functions في folder `/api`
- تأكد من كتابة اسم الـ file بشكل صحيح

### 2. CORS errors
- تحقق من `ALLOWED_ORIGINS` environment variable
- تأكد أنها تطابق Vercel domain

### 3. MongoDB connection timeout
- تأكد أن `MONGODB_URI` صحيح
- تأكد أن MongoDB Atlas IP whitelist يتضمن all IPs (0.0.0.0/0)

---

Made with ❤️ by the EduFlow Team
