# 🎓 EduFlow - Educational Platform

An educational management system built with React and Node.js that allows teachers and administrators to manage exams, video lessons, summaries, and live sessions.

## 🌟 Features

- **📚 Exam Management**: Create, edit, and manage exams with multiple question types (MCQ, True/False)
- **🎥 Video Management**: Upload and organize educational videos
- **📄 Summaries**: Upload and manage study summaries
- **🔴 Live Sessions**: Schedule and manage live teaching sessions
- **👥 Admin Dashboard**: Complete control panel for content management
- **🛡️ Authentication**: Secure admin login
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/eduflow.git
cd eduflow
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `.env` file in root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```
MONGODB_URI=your_mongodb_connection_string
DB_NAME=eduflow
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
VITE_ADMIN_PASSWORD=your_secure_password
```

### Running the Application

**Terminal 1 - Backend (Port 5000)**
```bash
cd backend
npm start
# or for development with watch
npm run dev
```

**Terminal 2 - Frontend (Port 5173)**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

Production files will be in `dist/` directory.

## 📁 Project Structure

```
eduflow/
├── backend/
│   ├── routes/
│   │   ├── exams.js
│   │   ├── summaries.js
│   │   ├── videos.js
│   │   └── lives.js
│   ├── middleware/
│   │   └── validation.js
│   ├── db.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── api/
│   │   ├── data/
│   │   └── utils/
│   ├── styles/
│   ├── main.tsx
│   └── App.tsx
├── .env.example
├── .gitignore
├── vite.config.ts
└── package.json
```

## 🔐 Security Features

- **Input Validation**: All API endpoints validate incoming data
- **CORS Protection**: Restricted to allowed origins only
- **Environment Variables**: Sensitive data stored securely
- **Security Headers**: Protection against XSS and clickjacking
- **Error Handling**: Generic error messages to clients

For detailed security information, see [SECURITY.md](SECURITY.md)

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Summaries
- `GET /summaries` - Get all summaries
- `POST /summaries` - Create new summary (requires validation)
- `GET /summaries/:id` - Get specific summary
- `PUT /summaries/:id` - Update summary
- `DELETE /summaries/:id` - Delete summary

#### Videos
- `GET /videos` - Get all videos
- `POST /videos` - Create new video (requires validation)
- `GET /videos/:id` - Get specific video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

#### Live Sessions
- `GET /lives` - Get all live sessions
- `POST /lives` - Create new session (requires validation)
- `GET /lives/:id` - Get specific session
- `PUT /lives/:id` - Update session
- `DELETE /lives/:id` - Delete session

## 📊 Database Schema

All collections use the following ID format:
- `id`: String (timestamp-based: `Date.now().toString()`)

### Summary Collection
```json
{
  "id": "1735560000000",
  "title": "Chapter 1",
  "titleAr": "الفصل 1",
  "description": "Introduction...",
  "fileUrl": "https://example.com/file.pdf",
  "subjectCode": "ACCT150",
  "downloads": 5,
  "uploadDate": "2024-12-29T10:30:00Z"
}
```

## 🧪 Testing Security

Before deployment, run these checks:

```bash
# Check for exposed credentials
grep -r "mongodb+srv" ./src ./backend --exclude-dir=node_modules

# Check dependencies for vulnerabilities
npm audit
cd backend && npm audit

# Check for console logs with sensitive data
grep -r "console.log\|console.error" ./backend --exclude-dir=node_modules
```

## 📝 Environment Variables

Required environment variables (see `.env.example` for all options):

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@host` |
| `DB_NAME` | Database name | `eduflow` |
| `PORT` | Backend port | `5000` |
| `ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `VITE_ADMIN_PASSWORD` | Admin panel password | `secure_password` |

## 🐛 Known Issues

1. Admin authentication needs server-side implementation
2. Rate limiting not yet implemented
3. File upload malware scanning needed
4. HTTPS enforcement required for production

## 🔄 Deployment

### Prerequisites
- GitHub account for version control
- Hosting provider (Vercel, Heroku, etc.)
- MongoDB Atlas cluster

### Before Pushing to GitHub
- [ ] Remove any `.env` files
- [ ] Verify `.gitignore` is properly configured
- [ ] Check for hardcoded credentials
- [ ] Review error messages (no sensitive details)
- [ ] Test all API endpoints

### Deployment Steps

1. **Create GitHub Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/eduflow.git
git push -u origin main
```

2. **Deploy Backend** (e.g., on Heroku)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_prod_uri
git push heroku main
```

3. **Deploy Frontend** (e.g., on Vercel)
```bash
# Connect to Vercel via Git
# Set environment variables in Vercel dashboard
# Automatic deployment on push
```

## 📚 Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, MongoDB
- **Tools**: Vite, ESBuild

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@eduflow.app or open an issue on GitHub.

## ⚠️ Security Notice

If you discover a security vulnerability, please email security@eduflow.app instead of using the issue tracker.

---

Made with ❤️ by the EduFlow Team
