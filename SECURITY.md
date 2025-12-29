# Security Guidelines

## Critical Security Measures

### 1. Environment Variables
- **NEVER commit `.env` files to version control**
- Always use `.env.example` as a template
- Each developer should have their own `.env` file
- Change default passwords and API keys in production

### 2. MongoDB Credentials
- Keep `MONGODB_URI` in environment variables only
- Use MongoDB Atlas IP Whitelist
- Enable authentication on your MongoDB cluster
- Use strong passwords (>12 characters)

### 3. CORS Configuration
- Only allow trusted origins in `ALLOWED_ORIGINS`
- Never use `*` in production (currently restricted)
- Test CORS headers for your specific domains

### 4. Input Validation
- All API endpoints validate input fields
- Check data types, lengths, and formats
- Reject invalid requests with 400 status codes

### 5. Rate Limiting
- Implement rate limiting in production (TODO: add express-rate-limit)
- Prevent brute force attacks and DoS

### 6. Error Handling
- Never expose internal error details to clients
- Log errors server-side for debugging
- Return generic error messages

### 7. File Upload Size Limits
- Max file size: 50MB (reduced from 500MB for security)
- Validate file types on server-side
- Scan uploads for malware before storing

### 8. Database Security
- Use MongoDB transactions for critical operations
- Implement proper access control (TODO)
- Regular backups with encrypted storage

### 9. HTTPS/TLS
- Always use HTTPS in production
- Use modern TLS versions (1.2+)
- Set `Strict-Transport-Security` header

### 10. Authentication (TODO)
- Implement JWT authentication for admin operations
- Verify tokens on every protected endpoint
- Set appropriate token expiration times

## Security Headers
The following security headers are automatically set:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Strict-Transport-Security` - Enforces HTTPS

## Testing Security
Run these checks before deploying:
```bash
# Check for hardcoded credentials
grep -r "mongodb+srv" ./src ./backend --exclude-dir=node_modules

# Check for exposed API keys
grep -r "MONGODB_URI\|API_KEY\|SECRET" ./src ./backend --exclude=.env --exclude-dir=node_modules

# Check dependencies for vulnerabilities
npm audit
cd backend && npm audit
```

## Before GitHub Upload
- [ ] Remove all hardcoded credentials
- [ ] Create `.env` file from `.env.example`
- [ ] Verify `.gitignore` includes `.env` files
- [ ] Check for console.log statements with sensitive data
- [ ] Review error messages (no detailed stack traces)
- [ ] Test CORS with your actual domain
- [ ] Change default MongoDB user credentials

## Known Issues to Address
1. Admin operations need authentication/authorization
2. Rate limiting not implemented
3. File upload malware scanning not implemented
4. HTTPS enforcement in production

## Reporting Security Issues
Found a security vulnerability? Please report it responsibly without creating a public issue.
