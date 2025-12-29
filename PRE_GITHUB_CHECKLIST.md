# 📋 Pre-GitHub Upload Checklist

Complete this checklist before pushing to GitHub to ensure security and code quality.

## 🔐 Security Checks

- [ ] **No hardcoded credentials**
  ```bash
  grep -r "mongodb+srv" ./src ./backend --exclude-dir=node_modules
  grep -r "password.*=" ./src --exclude-dir=node_modules --exclude="*.log"
  ```

- [ ] **Environment variables set**
  - [ ] `.env` file created from `.env.example`
  - [ ] `.env` file in `.gitignore`
  - [ ] All required variables set in `.env`

- [ ] **No sensitive console.logs**
  ```bash
  grep -r "console.log" ./backend | grep -i "user\|password\|token\|secret\|api"
  ```

- [ ] **Admin password uses environment variable**
  - [ ] Check `AdminLogin.tsx` uses `import.meta.env.VITE_ADMIN_PASSWORD`

- [ ] **CORS properly configured**
  - [ ] `ALLOWED_ORIGINS` set to specific domains
  - [ ] Not using `*` in production

- [ ] **Error messages don't expose internals**
  - [ ] Check all API error responses
  - [ ] No stack traces sent to clients

## 📦 Dependency Checks

- [ ] **No vulnerabilities in dependencies**
  ```bash
  npm audit
  cd backend && npm audit
  ```

- [ ] **Remove unused dependencies**
  ```bash
  # Review package.json for unused packages
  npm list # shows all dependencies
  ```

## 🧹 Code Quality

- [ ] **No debug code left**
  - [ ] Remove console.logs (keep only errors)
  - [ ] Remove commented-out code
  - [ ] Remove TODO comments for sensitive operations

- [ ] **ESLint passes**
  ```bash
  npm run lint
  ```

- [ ] **TypeScript compiles without errors**
  ```bash
  npm run build
  ```

## 📁 File Configuration

- [ ] **.gitignore is comprehensive**
  - [ ] `.env*` files included
  - [ ] `node_modules/` included
  - [ ] IDE files (`.vscode/`, `.idea/`)
  - [ ] Build output (`dist/`, `build/`)

- [ ] **.env.example is updated**
  - [ ] All required variables documented
  - [ ] No real values in example file

- [ ] **Build configuration correct**
  - [ ] `vite.config.ts` base path set correctly
  - [ ] Sourcemaps disabled in production (`build.sourcemap: false`)
  - [ ] Environment variables properly loaded

## 🔄 API Security

- [ ] **Input validation on all endpoints**
  - [ ] Required fields checked
  - [ ] Field types validated
  - [ ] Field lengths enforced
  - [ ] Invalid requests return 400

- [ ] **No SQL injection vulnerabilities**
  - [ ] Using parameterized queries
  - [ ] No string concatenation in queries

- [ ] **MongoDB injection prevention**
  - [ ] Validate ID format (digits only)
  - [ ] No dynamic query construction

## 📝 Documentation

- [ ] **README.md is comprehensive**
  - [ ] Installation instructions
  - [ ] Configuration guide
  - [ ] API documentation
  - [ ] Development setup

- [ ] **SECURITY.md exists and complete**
  - [ ] Security best practices
  - [ ] Known issues listed
  - [ ] Deployment security tips

- [ ] **Comments explain critical code**
  - [ ] Validation logic documented
  - [ ] CORS rules explained
  - [ ] Security decisions noted

## 🧪 Testing

- [ ] **Manual testing completed**
  - [ ] All CRUD operations tested
  - [ ] Admin login works
  - [ ] Add summary/video/live works
  - [ ] Delete operations work
  - [ ] Update operations work
  - [ ] Error handling works

- [ ] **API endpoints tested**
  ```bash
  # Test health check
  curl http://localhost:5000/api/health
  
  # Test CORS headers
  curl -i -X OPTIONS http://localhost:5000/api/summaries
  ```

- [ ] **Frontend loads correctly**
  - [ ] No 404 errors
  - [ ] Images load properly
  - [ ] API calls work
  - [ ] No browser console errors

## 🚀 Deployment Readiness

- [ ] **Environment files prepared**
  - [ ] `.env.example` with all variables
  - [ ] Instructions for setting environment variables
  - [ ] Documentation for each variable

- [ ] **Database backups configured**
  - [ ] MongoDB Atlas backups enabled
  - [ ] Backup retention policy set

- [ ] **Monitoring/Logging setup**
  - [ ] Error logging configured
  - [ ] API monitoring enabled
  - [ ] Performance metrics setup

## 📋 Pre-Push Verification

Run these before final push:

```bash
# 1. Check git status
git status

# 2. Verify no .env files will be committed
git diff --cached | grep -i ".env"

# 3. Build frontend
npm run build

# 4. Install and audit
npm install
npm audit
cd backend && npm install && npm audit
cd ..

# 5. Run tests (if any)
npm test

# 6. Final check for credentials
grep -r "password\|secret\|key\|token" \
  ./src ./backend \
  --exclude-dir=node_modules \
  --exclude="*.lock" \
  | grep -v ".env.example"
```

## ✅ Final Steps

- [ ] All checks passed
- [ ] Update version number
- [ ] Create/update CHANGELOG.md
- [ ] Write descriptive commit message
- [ ] Review all changes one final time

```bash
# Final commit
git add .
git commit -m "Final security review and cleanup before public release"
git push origin main
```

---

**Checklist Version**: 1.0  
**Last Updated**: 2024-12-29  
**Do not skip any items - Security is critical!**
