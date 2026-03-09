# Render Deployment Setup Guide

## Database Connection Issue Fix

### Problem:
`channel_binding=require` parameter causes connection issues on Render.

### Solution:
Use this DATABASE_URL format in Render environment variables:

```
postgresql://neondb_owner:npg_ByA3rIZX7JWj@ep-rapid-smoke-a130cfgm-pooler.ap-southeast-1.aws.neon.tech/course-registration-db?sslmode=require
```

**Important:** Remove `&channel_binding=require` from the connection string!

---

## Complete Render Environment Variables

Add these in Render Dashboard → Your Service → Environment:

```bash
# Database (CRITICAL - Remove channel_binding!)
DATABASE_URL=postgresql://username:password@host.region.aws.neon.tech/dbname?sslmode=require

# JWT Secret
JWT_SECRET=your_secure_random_string_here

# Server Config
PORT=10000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://course-registration-new.netlify.app

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3

# Password Reset
RESET_TOKEN_EXPIRY_MINUTES=15
RESET_TOKEN_MAX_ATTEMPTS=3

# SendGrid Email (Get from SendGrid Dashboard)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
SENDGRID_FROM_NAME=Course Registration System
```

---

## Deployment Steps

### 1. Update Environment Variables
- Go to Render Dashboard
- Select your backend service
- Click "Environment" tab
- Update `DATABASE_URL` (remove `channel_binding=require`)
- Add all other variables listed above
- Click "Save Changes"

### 2. Manual Deploy (Recommended)
- Click "Manual Deploy" → "Clear build cache & deploy"
- This ensures fresh build with new environment variables

### 3. Check Logs
After deployment:
- Go to "Logs" tab
- Look for:
  - ✅ "Database connected successfully"
  - ✅ "Server running on port 10000"
  - ❌ Any connection errors

### 4. Test Endpoints
Once deployed, test:
- `https://your-backend.onrender.com/` → Should show API info
- `https://your-backend.onrender.com/test` → Should return "Server is running"

---

## Common Issues & Fixes

### Issue 1: "Connection timeout"
**Fix:** Check if DATABASE_URL has `sslmode=require` (not `disable`)

### Issue 2: "SSL connection required"
**Fix:** Ensure `?sslmode=require` is at the end of DATABASE_URL

### Issue 3: "channel_binding error"
**Fix:** Remove `&channel_binding=require` from DATABASE_URL

### Issue 4: "Prisma Client not generated"
**Fix:** Build command should include: `npx prisma generate`

---

## Verify Database Tables

After successful deployment, check if tables exist:

1. Go to Neon Dashboard → SQL Editor
2. Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see all tables: Student, Teacher, Course, etc.

If tables are missing, run:
- `database-setup.sql` (creates tables)
- `dummy-data.sql` (adds test data)

---

## Testing Credentials

After setup, test with these accounts:

**Admin:**
- Email: admin@amu.ac.in
- Password: password123

**Student:**
- Email: gf2201@myamu.ac.in
- Password: password123

**Teacher:**
- Email: rajesh.kumar@amu.ac.in
- Password: password123
