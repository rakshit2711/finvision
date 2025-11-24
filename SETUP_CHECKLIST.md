# 🎯 FinVision AI - Setup Checklist

Use this checklist to ensure your backend is properly configured and running.

## ☑️ Pre-Setup Checklist

- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL installed (or cloud database account ready)
- [ ] Git installed (if cloning from repository)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/PowerShell access

## ☑️ Database Setup

### Option A: Local PostgreSQL
- [ ] PostgreSQL service is running
- [ ] Database `fintech_db` created
- [ ] Database credentials noted down
- [ ] `.env` file updated with correct DATABASE_URL

### Option B: Cloud Database (Neon/Supabase)
- [ ] Account created on Neon or Supabase
- [ ] New project/database created
- [ ] Connection string copied
- [ ] `.env` file updated with connection string

## ☑️ Installation Steps

- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database migrations run (`npx prisma migrate dev --name init`)
- [ ] No errors in terminal output

## ☑️ Environment Configuration

Check your `.env` file has:
- [ ] DATABASE_URL (valid PostgreSQL connection string)
- [ ] JWT_SECRET (at least 32 characters)
- [ ] NEXT_PUBLIC_APP_URL (http://localhost:3000 for dev)

## ☑️ Testing the Application

### 1. Start Development Server
- [ ] Run `npm run dev`
- [ ] No compilation errors
- [ ] Server running on http://localhost:3000

### 2. Test Landing Page
- [ ] Open http://localhost:3000
- [ ] Landing page loads correctly
- [ ] "Get Started" and "Sign In" buttons visible
- [ ] No console errors in browser

### 3. Test Signup Flow
- [ ] Navigate to `/signup`
- [ ] Fill in name, email, and password
- [ ] Password strength indicator works
- [ ] Click "Create account"
- [ ] Redirected to `/dashboard`
- [ ] Welcome message shows your name

### 4. Test Dashboard
- [ ] Dashboard loads successfully
- [ ] User name displayed in header
- [ ] No transactions/budgets message shown (for new user)
- [ ] Logout button visible in header

### 5. Test Logout
- [ ] Click logout button in header
- [ ] Redirected to `/login`
- [ ] Cannot access `/dashboard` without login

### 6. Test Login Flow
- [ ] Navigate to `/login`
- [ ] Enter credentials from signup
- [ ] Click "Sign in"
- [ ] Redirected to `/dashboard`
- [ ] Logged in successfully

### 7. Test Route Protection
- [ ] While logged out, try to access `/dashboard`
- [ ] Should redirect to `/login`
- [ ] While logged in, try to access `/login`
- [ ] Should redirect to `/dashboard`

## ☑️ API Testing

### Test with Browser DevTools (Network Tab)

#### Auth APIs
- [ ] POST `/api/auth/signup` - Returns 201 on success
- [ ] POST `/api/auth/login` - Returns 200 on success
- [ ] GET `/api/auth/me` - Returns user data when logged in
- [ ] POST `/api/auth/logout` - Returns 200 on success

#### Transaction APIs
- [ ] GET `/api/transactions` - Returns empty array for new user
- [ ] POST `/api/transactions` - Creates new transaction (test with form)
- [ ] GET `/api/transactions` - Returns created transaction
- [ ] DELETE `/api/transactions?id=xxx` - Deletes transaction

#### Budget APIs
- [ ] GET `/api/budgets` - Returns empty array for new user
- [ ] POST `/api/budgets` - Creates new budget
- [ ] GET `/api/budgets` - Returns created budget with spent amount
- [ ] PUT `/api/budgets` - Updates budget limit
- [ ] DELETE `/api/budgets?id=xxx` - Deletes budget

## ☑️ Database Verification

### Using Prisma Studio
- [ ] Run `http://localhost:3000/api/auth/me`
- [ ] Prisma Studio opens in browser (http://localhost:5555)
- [ ] See `users`, `transactions`, and `budgets` tables
- [ ] Can view created records
- [ ] Data matches what's shown in app

### Manual Verification (PostgreSQL)
```sql
-- Check if tables exist
\dt

-- Check user records
SELECT id, email, name, "createdAt" FROM users;

-- Check transactions
SELECT id, type, amount, category, description FROM transactions;

-- Check budgets
SELECT id, category, limit, period FROM budgets;
```

## ☑️ Common Issues Resolution

### Issue: "Can't reach database server"
- [ ] PostgreSQL service is running
- [ ] DATABASE_URL is correct in `.env`
- [ ] Database exists
- [ ] Firewall not blocking connection
- [ ] Tried restarting database service

### Issue: "Module not found: @prisma/client"
- [ ] Ran `npx prisma generate`
- [ ] Ran `npm install`
- [ ] Restarted dev server

### Issue: "Invalid prisma.xxx invocation"
- [ ] Ran migrations: `npx prisma migrate dev`
- [ ] Schema is valid (no syntax errors)
- [ ] Database URL is correct

### Issue: Login not working
- [ ] JWT_SECRET is set in `.env`
- [ ] Cleared browser cookies
- [ ] Checked browser console for errors
- [ ] Verified API routes are accessible

### Issue: "Unauthorized" errors
- [ ] Logged in successfully
- [ ] Session cookie is set (check browser DevTools)
- [ ] JWT_SECRET matches between app restarts

## ☑️ Production Readiness

Before deploying to production:
- [ ] Changed JWT_SECRET to a strong random string
- [ ] Updated DATABASE_URL to production database
- [ ] Set NODE_ENV=production
- [ ] Ran `npm run build` successfully
- [ ] Tested production build locally
- [ ] Added `.env` to `.gitignore`
- [ ] Removed any console.log statements
- [ ] Set up proper error monitoring

## ☑️ Optional Enhancements

- [ ] Set up Docker for PostgreSQL
- [ ] Configure database backups
- [ ] Add database connection pooling
- [ ] Set up Redis for sessions (optional)
- [ ] Configure CORS if needed
- [ ] Add rate limiting for APIs
- [ ] Set up logging service
- [ ] Configure SSL for database connection

## 🎉 Success Criteria

Your backend is fully operational when:
- ✅ Users can sign up and login
- ✅ Dashboard shows personalized data
- ✅ Transactions can be created and viewed
- ✅ Budgets can be set and tracked
- ✅ Route protection works correctly
- ✅ Data persists across sessions
- ✅ No console errors or warnings
- ✅ All API endpoints respond correctly

## 📞 Getting Help

If you encounter issues:

1. Check `BACKEND_SETUP.md` for detailed documentation
2. Review `IMPLEMENTATION_SUMMARY.md` for implementation details
3. Check browser console for errors
4. Check terminal for server errors
5. Verify Prisma Studio shows correct data structure
6. Review environment variables in `.env`

## 🚀 Next Steps

After completing this checklist:
1. Start building enhanced expense management UI
2. Implement budget creation forms
3. Add AI insights generation
4. Create data visualization components
5. Add export functionality
6. Implement recurring transactions

---

**Need to reset everything?**
```bash
# WARNING: This deletes all data
npx prisma migrate reset

# Then re-run migrations
npx prisma migrate dev --name init
```

**View this checklist while working:**
Keep this file open in your editor as you work through the setup process!
