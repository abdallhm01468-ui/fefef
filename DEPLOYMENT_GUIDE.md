# 🚀 Deployment Guide

## قبل النشر - خطوات حاسمة

### 1. تنظيف الكود نهائياً
```bash
# إزالة جميع console.logs
grep -rn "console.log" src/ backend/ --exclude-dir=node_modules | wc -l
```

### 2. فحص الأمان النهائي
```bash
# تحقق من عدم وجود credentials
grep -r "mongodb\|password\|secret\|api.key" \
  ./src ./backend \
  --exclude-dir=node_modules \
  --exclude=".env.example"

# يجب أن لا يجد شيء
```

### 3. بناء التطبيق
```bash
# Frontend
npm install
npm run build

# Backend
cd backend
npm install
npm audit --audit-level=moderate
```

### 4. الملفات المطلوبة للنشر

**ملفات يجب أن تكون موجودة:**
- ✅ `.env.example` - نموذج المتغيرات
- ✅ `README_FULL.md` - التوثيق الكامل
- ✅ `SECURITY.md` - دليل الأمان
- ✅ `CHANGELOG.md` - سجل التغييرات
- ✅ `LICENSE` - رخصة المشروع

**ملفات يجب أن تكون في .gitignore:**
- ✅ `.env` - بيانات المحلي
- ✅ `node_modules/` - dependencies
- ✅ `dist/` - build output

## خطوات النشر

### الخيار 1: النشر على Vercel (الأسهل)

#### Frontend:
```bash
# 1. نسخ المشروع على GitHub
git push origin main

# 2. اذهب إلى https://vercel.com
# 3. اختر "Import Project"
# 4. اختر repository الخاص بك

# 5. في Project Settings، أضف Environment Variables:
# VITE_API_URL=https://your-backend-url/api
# VITE_ADMIN_PASSWORD=your-secure-password

# 6. اضغط Deploy
```

#### Backend (على Heroku):
```bash
# 1. قم بالتسجيل على heroku.com
# 2. نسخ backend فقط إلى git جديد أو branch

# 3. نشر على Heroku
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_connection
heroku config:set DB_NAME=eduflow
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url
git push heroku main

# 4. التحقق
heroku logs --tail
```

### الخيار 2: النشر على Railway (الأسهل للـ Backend)

#### Backend على Railway:
```bash
# 1. اذهب إلى https://railway.app
# 2. اضغط "New Project"
# 3. اختر "Deploy from GitHub"

# 4. اختر repository
# 5. في Variables، أضف:
MONGODB_URI=your_mongodb_uri
DB_NAME=eduflow
ALLOWED_ORIGINS=https://your-frontend-url
PORT=5000

# 6. Deploy
```

### الخيار 3: النشر الذاتي (Self-hosted)

#### Requirements:
- Server مع Node.js 16+
- MongoDB Atlas account
- Domain name (اختياري)

#### الخطوات:
```bash
# 1. SSH إلى السيرفر
ssh user@your-server.com

# 2. استنساخ المشروع
git clone https://github.com/yourusername/eduflow.git
cd eduflow

# 3. إعداد Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. تثبيت PM2 (process manager)
sudo npm install -g pm2

# 5. تثبيت Dependencies
npm install
cd backend && npm install && cd ..

# 6. إنشاء .env
cp .env.example .env
nano .env  # عدّل مع قيمك

# 7. بناء Frontend
npm run build

# 8. تشغيل Backend مع PM2
cd backend
pm2 start server.js --name "eduflow-backend"
pm2 save
pm2 startup

# 9. تشغيل Frontend (مع nginx أو similar)
# انسخ محتويات dist/ إلى /var/www/eduflow
sudo cp -r ../dist/* /var/www/eduflow/

# 10. إعداد Nginx (اختياري)
# انظر nginx-config.example
```

## متطلبات الإنتاج

### MongoDB Atlas
1. اذهب إلى https://www.mongodb.com/cloud/atlas
2. أنشئ cluster مجاني
3. أضف IP address الخادم الخاص بك إلى Network Access
4. أنشئ database user بكلمة سر قوية
5. انسخ connection string

### Domain + SSL
```bash
# إذا كنت تستخدم Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Environment Variables للإنتاج

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_ADMIN_PASSWORD=your_very_secure_password_here
```

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection
DB_NAME=eduflow
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## بعد النشر

### 1. الفحوصات الأساسية
```bash
# تحقق من الموقع يحمل
curl -i https://your-domain.com

# تحقق من API
curl -i https://your-api-domain.com/api/health

# تحقق من CORS headers
curl -i -X OPTIONS https://your-api-domain.com/api/summaries
```

### 2. إعدادات الأمان
- [ ] HTTPS مفعّل
- [ ] CORS محدد للـ domain فقط
- [ ] Admin password قوي ومعقد
- [ ] MongoDB backups مفعّل
- [ ] Monitoring configured

### 3. اختبار الوظائف
- [ ] تسجيل الدخول للإدمن
- [ ] إضافة ملخص
- [ ] إضافة فيديو
- [ ] إضافة جلسة لايف
- [ ] حذف المحتويات
- [ ] أخذ الامتحانات

### 4. Monitoring
```bash
# إذا استخدمت PM2
pm2 logs eduflow-backend
pm2 monit

# إذا استخدمت Heroku
heroku logs --tail -a your-app-name

# إذا استخدمت Railway
railway logs
```

## الصيانة المستمرة

### تحديثات الأمان
```bash
# فحص الثغرات بانتظام
npm audit
cd backend && npm audit

# تحديث Dependencies
npm update
npm audit fix
```

### المراقبة والنسخ الاحتياطية
- [ ] تفعيل MongoDB backups
- [ ] مراقبة API errors
- [ ] تتبع uptime
- [ ] مراجعة الـ logs أسبوعياً

### التحديثات
```bash
# تحديث الكود
git pull origin main
npm install
npm run build
pm2 restart eduflow-backend
```

## استكشاف الأخطاء

### Backend لا يبدأ
```bash
# تحقق من port
lsof -i :5000

# تحقق من MongoDB
ping cluster0.mongodb.net

# عرض logs
pm2 logs eduflow-backend
```

### Frontend 404 errors
- تحقق من API_URL في .env
- تحقق من CORS configuration
- افحص browser console

### Database connection issues
```bash
# اختبر الاتصال
mongosh "your_connection_string"

# تحقق من IP whitelist
# في MongoDB Atlas Dashboard > Network Access
```

## قائمة تحقق النشر النهائية

- [ ] جميع console.logs مزالة
- [ ] جميع credentials في .env
- [ ] .env موجود محليًا فقط
- [ ] Build ناجح بدون errors
- [ ] npm audit نظيف
- [ ] HTTPS مفعّل
- [ ] CORS محدد
- [ ] Database backups
- [ ] Monitoring configured
- [ ] تم اختبار جميع الوظائف

---

**الآن أنت جاهز للإطلاق! 🚀**
