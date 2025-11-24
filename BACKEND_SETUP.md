# Backend Setup Guide

## Overview
This fintech application now includes a complete backend with:
- **Authentication**: Login/Signup with JWT tokens
- **Database**: PostgreSQL with Prisma ORM
- **Protected Routes**: Middleware for secure access
- **API Endpoints**: Full CRUD for transactions and budgets

## 🗄️ Database Setup

### Option 1: Local PostgreSQL (Recommended for Development)

#### Install PostgreSQL
1. **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Mac**: `brew install postgresql`
3. **Linux**: `sudo apt-get install postgresql`

#### Create Database
```bash
# Start PostgreSQL service
# Windows: Start from Services
# Mac/Linux: brew services start postgresql

# Create database
psql -U postgres
CREATE DATABASE fintech_db;
\q
```

#### Update .env file
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fintech_db?schema=public"
```

### Option 2: Free Cloud Database

#### Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Update `.env` with your connection string

#### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use "Transaction Pooler" mode)
5. Update `.env` with your connection string

## 🚀 Running the Backend

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. (Optional) Open Prisma Studio to view database
```bash
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
```

## 📱 Using the Application

### 1. Create an Account
- Navigate to `/signup`
- Enter your name, email, and password
- You'll be automatically logged in and redirected to dashboard

### 2. Login
- Navigate to `/login`
- Enter your credentials
- Access your personalized dashboard

### 3. Manage Transactions
- Use the Expenses page to add income/expenses
- All data is stored in your database
- Filter by date, category, or type

### 4. Set Budgets
- Navigate to Budget page
- Create category-based budgets
- Track spending against limits

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Protected Routes**: Middleware blocks unauthorized access
- **User Isolation**: Each user only sees their own data

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts       # POST /api/auth/login
│   │   ├── signup/route.ts      # POST /api/auth/signup
│   │   ├── logout/route.ts      # POST /api/auth/logout
│   │   └── me/route.ts          # GET /api/auth/me
│   ├── transactions/route.ts    # GET, POST, DELETE
│   └── budgets/route.ts         # GET, POST, PUT, DELETE
├── login/page.tsx
├── signup/page.tsx
└── dashboard/page.tsx

lib/
├── prisma.ts                    # Prisma client
├── auth.ts                      # Authentication utilities
└── types.ts                     # TypeScript types

prisma/
└── schema.prisma                # Database schema

middleware.ts                     # Route protection
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/fintech_db?schema=public"

# JWT Secret (CHANGE THIS!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-32-chars-minimum"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📊 Database Schema

### Users Table
- id (String, Primary Key)
- email (String, Unique)
- name (String, Optional)
- password (String, Hashed)
- createdAt (DateTime)
- updatedAt (DateTime)

### Transactions Table
- id (String, Primary Key)
- type (Enum: INCOME, EXPENSE)
- amount (Float)
- category (String)
- description (String)
- date (DateTime)
- userId (String, Foreign Key)

### Budgets Table
- id (String, Primary Key)
- category (String)
- limit (Float)
- period (Enum: WEEKLY, MONTHLY, YEARLY)
- userId (String, Foreign Key)

## 🛠️ Common Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio

# Format schema file
npx prisma format

# Pull schema from existing database
npx prisma db pull

# Push schema without migrations (development)
npx prisma db push
```

## 🐛 Troubleshooting

### "Can't reach database server"
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Check firewall settings

### "Module not found: Can't resolve '@prisma/client'"
```bash
npx prisma generate
```

### "Invalid `prisma.table.create()` invocation"
- Run migrations: `npx prisma migrate dev`
- Check schema.prisma for errors

### Authentication not working
- Check JWT_SECRET is set in .env
- Clear browser cookies
- Verify API routes are accessible

## 📝 API Documentation

### Authentication

#### POST /api/auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Returns current user information (requires authentication)

#### POST /api/auth/logout
Logs out current user

### Transactions

#### GET /api/transactions
Query params: `type`, `category`, `startDate`, `endDate`

#### POST /api/transactions
```json
{
  "type": "EXPENSE",
  "amount": 50.00,
  "category": "Food & Dining",
  "description": "Lunch",
  "date": "2024-01-15T12:00:00Z"
}
```

#### DELETE /api/transactions?id={transactionId}
Deletes a transaction

### Budgets

#### GET /api/budgets
Returns all budgets with calculated spent amounts

#### POST /api/budgets
```json
{
  "category": "Food & Dining",
  "limit": 500.00,
  "period": "MONTHLY"
}
```

#### PUT /api/budgets
```json
{
  "id": "budget_id",
  "limit": 600.00
}
```

#### DELETE /api/budgets?id={budgetId}
Deletes a budget

## 🚀 Deployment

### Vercel + Neon
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="generate-a-strong-secret-for-production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://jwt.io/introduction)
