# 💰 FinVision AI – Smart Insights, Smarter Decisions

An AI-powered personal finance management system with **full backend integration** that helps users make informed financial decisions through intelligent analysis, predictions, and personalized recommendations.

## 🎯 Project Overview

**Domain:** Web Development  
**Guide:** Dr. Deepa Joshi  
**Students:** Arav Kumar & Abhinav Rana (BTech CSE - Semester 7)

## 📋 Abstract

Managing personal finances is a challenge many individuals face. Existing finance management apps are either too basic or lack intelligent insights that truly help users understand their spending habits and make better financial decisions.

**FinVision AI** bridges the gap between raw financial data and actionable insights by leveraging Artificial Intelligence to:



- ✅ Analyze spending patterns
- ✅ Provide budgeting recommendations
- ✅ Predict future expenses
- ✅ Offer personalized financial insights
- ✅ Help users achieve their savings goals
- ✅ Reduce unnecessary expenses
- ✅ Improve long-term financial stability

## 🚀 New: Complete Backend Implementation

This project now includes a **fully functional backend** with:

- 🔐 **Secure Authentication** - JWT-based login/signup with password hashing
- 🗄️ **PostgreSQL Database** - Prisma ORM with type-safe queries
- 🛡️ **Protected Routes** - Middleware-based route protection
- 📡 **RESTful API** - Complete CRUD operations for transactions and budgets
- 👤 **User Management** - Individual user accounts with data isolation
- 🔒 **Security** - HTTP-only cookies, encrypted passwords, secure sessions

### Quick Start with Backend

```bash
# Option 1: Automated setup (Recommended)
.\setup.ps1

# Option 2: Manual setup
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

📖 **For detailed backend setup instructions, see [BACKEND_SETUP.md](./BACKEND_SETUP.md)**

## Learn More



## 🎯 Problem StatementTo learn more about Next.js, take a look at the following resources:



Individuals struggle with personal finance management due to the lack of:- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Real-time insights- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- Predictive analysis

- Personalized suggestionsYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



Existing tools only track income and expenses at a basic level without analyzing behavior or providing meaningful recommendations. There's a critical need for an AI-powered system that tracks transactions, analyzes patterns, predicts trends, and delivers customized financial advice.## Deploy on Vercel



## ✨ Key FeaturesThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



### 📊 DashboardCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- Real-time financial overview
- Income vs. Expense tracking
- Budget utilization metrics
- Quick insights and alerts

### 💳 Expense Tracking
- Add and categorize transactions
- Multiple category support (Food, Transport, Entertainment, etc.)
- Date-wise expense logging
- Visual expense breakdown

### 🤖 AI Insights
- Spending pattern analysis
- Future expense predictions
- Personalized recommendations
- Category-wise spending trends
- Anomaly detection

### 💰 Budget Management
- Set monthly budgets by category
- Track budget utilization
- Alerts for overspending
- Budget optimization suggestions

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with jose
- **Password Hashing:** bcryptjs
- **API:** Next.js App Router API Routes

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL (local or cloud service like Neon/Supabase)
- npm, yarn, pnpm, or bun

### Quick Setup (Recommended)

Run the automated setup script:

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd finvision-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Database**
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` in `.env`

4. **Initialize Database**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**
   - Click "Get Started" to create an account
   - Login and start managing your finances!

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fintech_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📁 Project Structure

```
finvision-ai/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── dashboard/            # Protected dashboard
│   ├── expenses/             # Expense tracking
│   ├── insights/             # AI insights
│   ├── budget/               # Budget management
│   └── api/
│       ├── auth/             # Authentication endpoints
│       ├── transactions/     # Transaction CRUD
│       └── budgets/          # Budget CRUD
├── components/               # Reusable UI components
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── prisma.ts            # Database client
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── prisma/
│   └── schema.prisma        # Database schema
├── middleware.ts            # Route protection
├── .env                     # Environment variables
├── setup.ps1                # Windows setup script
├── setup.sh                 # Unix setup script
├── BACKEND_SETUP.md         # Backend documentation
└── IMPLEMENTATION_SUMMARY.md # Complete implementation details
```

## 🌍 SDG Alignment

This project aligns with **UN Sustainable Development Goal 17: Partnerships for the Goals** by promoting financial literacy and responsible consumption patterns, contributing to overall economic well-being.

## 🎨 Features Implementation

### AI-Powered Analysis
- Pattern recognition in spending habits
- Predictive modeling for future expenses
- Personalized recommendations based on user behavior
- Anomaly detection for unusual transactions

### User Benefits
- Improved financial literacy
- Better spending awareness
- Achieving savings goals
- Reduced financial stress
- Long-term financial stability

## 🎯 Current Features

### ✅ Implemented
- ✅ User authentication (login/signup)
- ✅ Secure password handling
- ✅ Protected dashboard routes
- ✅ Transaction management (CRUD)
- ✅ Budget creation and tracking
- ✅ Real-time data from database
- ✅ User-specific data isolation
- ✅ Responsive UI design

### 🚧 Coming Soon
- Enhanced expense management UI
- AI-powered insights generation
- Spending pattern visualization
- Budget recommendations
- Export reports (PDF/Excel)
- Multi-currency support
- Recurring transactions

## 📊 Future Enhancements

- Integration with banking APIs
- Investment tracking
- Bill payment reminders
- Collaborative budgets for families
- Mobile app version
- Advanced analytics dashboard
- Financial goal setting

## 👥 Contributors

- **Arav Kumar** - BTech CSE, Semester 7
- **Abhinav Rana** - BTech CSE, Semester 7

**Guide:** Dr. Deepa Joshi

## 📄 License

This project is developed as part of academic curriculum.

## 🤝 Contributing

This is an academic project. For suggestions or improvements, please contact the project team.

---

**FinVision AI** - Empowering financial decisions through intelligent insights 🚀
