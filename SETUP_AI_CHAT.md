# 🚀 Quick Start Guide - AI Chat Setup

## Prerequisites
- Node.js 16+ installed
- npm or yarn
- Google Gemini API key

## Step 1: Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key
4. **Keep it secret!** ⚠️

## Step 2: Configure Backend

### 2.1 Create .env file
In `backend/` directory, create `.env`:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
GEMINI_API_KEY=AIzaSyD3o90V8nE-28Rg3ExNrbXQZQpNgaIhAqM

# Optional
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2.2 Install dependencies
```bash
cd backend
npm install
```

### 2.3 Start backend
```bash
npm run dev
```

Expected output:
```
🚀 EduFlow Backend running on http://localhost:5000
📊 API endpoints:
   - GET  /api/exams
   - POST /api/exams
   - POST /api/chat ✨ NEW
```

## Step 3: Configure Frontend

### 3.1 Create .env (if needed)
In root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=your_secure_password
```

### 3.2 Install dependencies
```bash
npm install
```

### 3.3 Start frontend
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## Step 4: Test Everything

### 4.1 Open Browser
Go to: `http://localhost:5173`

### 4.2 Navigate to AI Chat
Click "AI Chat" in navbar

### 4.3 Test with a message
Type: "السلام عليكم"

Expected:
- Message appears in chat
- Loading indicator shows
- AI response appears
- Chat history updates

### 4.4 Test Error Handling
Try sending empty message:
- Should show error "رسالة غير صحيحة"

Try sending very long message:
- Should show error about message length

## Step 5: Security Checklist

Before deploying to production:

- [ ] Verify Gemini API key is in `.env` (not in code)
- [ ] Verify `.env` is in `.gitignore`
- [ ] Check `/docs/SECURITY.md` for all recommendations
- [ ] Test rate limiting (manual: try 11 requests in 1 min)
- [ ] Verify API key not exposed in network tab
- [ ] Verify error messages don't show sensitive data

## Troubleshooting

### "API key غير متاح"
```bash
# Check .env exists
cat backend/.env | grep GEMINI_API_KEY

# Should show: GEMINI_API_KEY=AIzaSy...
```

### "Server not responding"
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"OK",...}
```

### "CORS error"
```bash
# Verify frontend URL is in ALLOWED_ORIGINS
# Add http://localhost:5173 if missing
```

### Network errors
1. Check browser console (F12)
2. Check backend logs (npm run dev output)
3. Verify both are running on correct ports

## File Structure

```
project/
├── backend/
│   ├── .env                    ← Add Gemini API key here!
│   ├── package.json            ← Updated with axios
│   ├── server.js               ← Chat route added
│   └── routes/
│       ├── chat.js            ← NEW: Gemini integration
│       ├── exams.js
│       ├── videos.js
│       ├── summaries.js
│       └── lives.js
├── src/
│   ├── utils/
│   │   ├── chatService.ts      ← NEW: Service layer
│   │   └── supabaseClient.ts   ← DEPRECATED
│   └── app/
│       └── components/
│           ├── ChatPage.tsx    ← NEW: Chat UI
│           ├── Navbar.tsx      ← Updated with chat link
│           └── App.tsx         ← Updated routing
├── .env.example                ← Updated
└── docs/
    └── AI_CHAT_FEATURE.md      ← Full documentation
```

## Next Steps

1. ✅ Backend running with Gemini API
2. ✅ Frontend showing Chat page
3. ✅ Messages being sent and received
4. → Add rate limiting (optional)
5. → Add conversation history to MongoDB (optional)
6. → Deploy to production

## Support Resources

- **Gemini API Docs**: https://ai.google.dev
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **MongoDB Docs**: https://docs.mongodb.com

## Commands Reference

```bash
# Backend
cd backend && npm run dev       # Start dev server
npm install axios               # Install missing dependency
npm run test                    # Run tests

# Frontend
npm run dev                     # Start dev server
npm run build                  # Build for production
npm run preview               # Preview production build

# Testing
node tests/chat-security-test.js  # Run security tests
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"مرحبا","history":[]}'
```

## Security Notes

⚠️ **NEVER do this:**
- Don't commit `.env` file to Git
- Don't paste API key in code
- Don't expose API key to frontend
- Don't log sensitive data

✅ **Always:**
- Keep `.env` in `.gitignore`
- Use environment variables
- Validate input on backend
- Handle errors gracefully

## Deployment Preparation

When ready to deploy:

1. Create production `.env`:
   ```env
   MONGODB_URI=production_uri
   GEMINI_API_KEY=production_key
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. Build frontend:
   ```bash
   npm run build
   ```

3. Deploy to hosting (Vercel, Railway, Render, etc.)

4. Run security tests on production

5. Monitor logs for errors

Good luck! 🚀
