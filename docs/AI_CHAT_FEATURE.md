# 🤖 AI Chat Feature Documentation

## Overview
EduFlow now includes an AI Chat assistant powered by **Google Gemini API**. This provides students with an intelligent learning companion to answer questions and explain concepts.

## Architecture

### Frontend Flow
```
ChatPage Component
    ↓
chatService.ts (API Client)
    ↓
POST /api/chat (Backend)
    ↓
Gemini API (Google)
```

### Security Features
✅ **API Key Protection**: Gemini API key stored ONLY in backend `.env`  
✅ **No Frontend Exposure**: API key never sent to browser  
✅ **Input Validation**: Message length limits and type checking  
✅ **Error Handling**: Generic error messages to clients  
✅ **CORS Restricted**: Only allowed origins can access  
✅ **Rate Limiting Ready**: Can be added to `/api/chat` endpoint  

## Setup

### 1. Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create a new API key
4. Copy the key

### 2. Configure Backend
Add to `.env` file in backend directory:
```env
GEMINI_API_KEY=your_api_key_here
```

**⚠️ Important**: Never commit this to Git!

### 3. Install Dependencies
```bash
cd backend
npm install axios
```

### 4. Start Backend
```bash
npm run dev
```

## API Endpoint

### POST /api/chat
Sends a message to Gemini AI and returns the response.

**Request:**
```json
{
  "message": "شرح قانون الفائدة البسيطة",
  "history": [
    {
      "role": "user",
      "content": "السؤال السابق"
    },
    {
      "role": "assistant",
      "content": "الرد السابق"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "reply": "قانون الفائدة البسيطة يحسب كالتالي..."
}
```

**Response (Error):**
```json
{
  "error": "عدد الطلبات كثير. حاول لاحقاً"
}
```

## Features

### 1. Message History
- Last 5 messages kept in conversation context
- Helps AI understand context better
- Stored in browser localStorage only
- Clear chat button to reset

### 2. Real-time Feedback
- Loading indicator while AI is thinking
- Error messages if API fails
- Timestamps for each message
- Typing indicator (optional enhancement)

### 3. Responsive Design
- Mobile-friendly interface
- Works on all devices
- Touch-optimized buttons
- Smooth scrolling to latest messages

## Security Considerations

### What's Protected?
✅ API Key (backend only)  
✅ Request validation  
✅ Error handling (no stack traces)  
✅ CORS restrictions  
✅ Content Security Policy ready  

### What Students See?
✓ Clean error messages  
✓ No technical details  
✓ No API credentials  
✓ No server information  

## Error Handling

### Common Errors

**1. "API key غير متاح"**
- Cause: `GEMINI_API_KEY` not set in `.env`
- Solution: Add the key and restart backend

**2. "عدد الطلبات كثير"**
- Cause: Rate limit exceeded on Gemini API
- Solution: Wait a few seconds and try again
- Enhancement: Implement rate limiting

**3. "انتهت مهلة الانتظار"**
- Cause: Gemini API timeout (>30s)
- Solution: Try a simpler question or try later

**4. "خطأ في معالجة الطلب"**
- Cause: Generic server error
- Check: Backend logs for details

## Monitoring

### Backend Logs
```
POST /api/chat
├─ Received message: "شرح..."
├─ Calling Gemini API...
├─ Response: "..." (tokens: X)
└─ Sent to client
```

### Development
Enable debug logs:
```javascript
console.log('Gemini API request:', prompt);
console.log('Gemini API response:', response.data);
```

## Future Enhancements

### Phase 2
- [ ] Conversation history in MongoDB
- [ ] User preferences (language, tone)
- [ ] Rate limiting per user
- [ ] Analytics and logging
- [ ] Typing indicator for better UX

### Phase 3
- [ ] Multi-language support
- [ ] PDF document Q&A
- [ ] Study plan generation
- [ ] Integration with exam content
- [ ] Offline mode

## Testing

### Manual Test
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"مرحبا","history":[]}'
```

### Automated Tests
```bash
node tests/chat-security-test.js
```

## Rate Limiting Recommendation

Add this middleware to `backend/routes/chat.js`:

```javascript
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'عدد الطلبات كثير جداً',
});

router.post('/chat', chatLimiter, async (req, res) => {
  // ... rest of code
});
```

Install: `npm install express-rate-limit`

## Files Modified

| File | Changes |
|------|---------|
| `src/utils/chatService.ts` | NEW: Service layer for chat API |
| `src/app/components/ChatPage.tsx` | NEW: UI component for chat |
| `backend/routes/chat.js` | NEW: Backend endpoint for Gemini |
| `backend/server.js` | Added chat route import |
| `src/app/App.tsx` | Added chat page routing |
| `src/app/components/Navbar.tsx` | Added AI Chat nav item |
| `.env.example` | Added GEMINI_API_KEY variable |
| `backend/package.json` | Added axios dependency |

## Support

For issues:
1. Check `.env` file has correct API key
2. Verify backend is running on port 5000
3. Check browser console for errors
4. Review backend logs for detailed errors
5. Test API with curl command above
