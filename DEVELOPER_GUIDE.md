# FinVision AI - Developer Guide

## 📚 Quick Start Guide

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- A code editor (VS Code recommended)

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd finvision-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Local: http://localhost:3000
   - Network: Check terminal output for network URL

## 📁 Project Structure Explained

### `/app` Directory (Next.js App Router)
- `page.tsx` - Main dashboard page
- `layout.tsx` - Root layout wrapper
- `globals.css` - Global styles and CSS variables
- `/expenses` - Expense tracking page
- `/insights` - AI insights page
- `/budget` - Budget management page

### `/components` Directory
Reusable React components:
- `Header.tsx` - Top navigation bar
- `Footer.tsx` - Footer with project info
- `Card.tsx` - Wrapper component for content sections
- `Button.tsx` - Styled button with variants
- `Input.tsx` - Form input with labels

### `/lib` Directory
Business logic and utilities:
- `types.ts` - TypeScript interfaces and types
- `utils.ts` - Helper functions and data processing

## 🔧 Key Functions & Utilities

### Data Processing (`lib/utils.ts`)

```typescript
// Format currency in Indian Rupees
formatCurrency(amount: number): string

// Calculate total income or expenses
calculateTotal(transactions, 'income' | 'expense'): number

// Group transactions by category
groupByCategory(transactions): CategoryData[]

// Filter transactions by month
filterTransactionsByMonth(transactions, date): Transaction[]

// Calculate budget utilization
calculateBudgetUtilization(budgets, transactions): Budget[]

// Generate AI insights
generateAIInsights(transactions, budgets): AIInsight[]

// Predict future expenses
predictFutureExpenses(transactions): SpendingPattern[]

// Generate sample demo data
generateSampleData(): { transactions, budgets }
```

## 🎨 Styling Guide

### Tailwind CSS Classes
The project uses Tailwind CSS 4 with custom configuration.

**Common Patterns:**
```tsx
// Card container
className="bg-white dark:bg-zinc-900 rounded-xl border"

// Primary button
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"

// Text colors
className="text-zinc-900 dark:text-zinc-100"  // Primary text
className="text-zinc-600 dark:text-zinc-400"  // Secondary text
```

### Color Scheme
- **Primary**: Blue (#3b82f6) to Purple (#9333ea) gradient
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

## 📊 Data Structure

### Transaction Type
```typescript
{
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}
```

### Budget Type
```typescript
{
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}
```

### AI Insight Type
```typescript
{
  id: string;
  type: 'warning' | 'info' | 'success' | 'prediction';
  title: string;
  description: string;
  category?: string;
  impact: 'high' | 'medium' | 'low';
}
```

## 🔄 Adding New Features

### Adding a New Category

1. **Update types** (`lib/types.ts`):
```typescript
export const EXPENSE_CATEGORIES = [
  // ... existing categories
  'New Category'
] as const;
```

2. **Add color** (`lib/utils.ts`):
```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  // ... existing colors
  'New Category': '#colorcode'
};
```

### Adding a New Page

1. **Create directory**: `app/new-page/`
2. **Add page.tsx**:
```typescript
'use client';

export default function NewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Your content */}
    </div>
  );
}
```

3. **Update Header navigation** (`components/Header.tsx`):
```typescript
const navItems = [
  // ... existing items
  { href: '/new-page', label: 'New Page', icon: IconName }
];
```

## 🎯 Common Tasks

### Modifying Sample Data

Edit `generateSampleData()` in `lib/utils.ts`:
```typescript
const transactions: Transaction[] = [
  // Add your transactions here
];

const budgets: Budget[] = [
  // Add your budgets here
];
```

### Changing Chart Colors

Update `CATEGORY_COLORS` in `lib/utils.ts` or use inline styles:
```tsx
<Cell fill="#your-color" />
```

### Adding Form Validation

Use HTML5 attributes or libraries:
```tsx
<Input
  type="number"
  required
  min="0"
  max="1000000"
/>
```

## 🐛 Debugging Tips

### Check Console Logs
Open browser DevTools (F12) and check Console tab

### React DevTools
Install React DevTools extension for component inspection

### Common Issues

**Issue**: Page not updating after changes
- **Solution**: Check if you saved the file. Next.js hot reload should work automatically.

**Issue**: TypeScript errors
- **Solution**: Run `npm run build` to see all TypeScript errors

**Issue**: Styling not applied
- **Solution**: Make sure Tailwind classes are correct and not purged

## 📦 Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Push code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Self-Hosted
```bash
npm run build
npm start
```

## 📝 Best Practices

1. **Component Structure**: Keep components small and focused
2. **Type Safety**: Use TypeScript types for all props
3. **Memoization**: Use `useMemo` for expensive calculations
4. **Client Components**: Add `'use client'` only when needed
5. **Accessibility**: Use semantic HTML and ARIA labels

## 🔐 Security Notes

**Current Implementation:**
- Client-side only (no database)
- Sample data stored in memory
- No authentication required

**For Production:**
- Add user authentication
- Implement secure API endpoints
- Use environment variables for secrets
- Validate all user inputs
- Sanitize data before storage

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contributing (for team members)

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

---

**Need Help?** Check the README.md or PROJECT_SUMMARY.md files for more information.
