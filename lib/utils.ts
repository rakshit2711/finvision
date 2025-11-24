import { Transaction, Budget, CategoryData, AIInsight, SpendingPattern } from './types';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

// Color palette for categories
export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FF6384',
  'Transportation': '#36A2EB',
  'Shopping': '#FFCE56',
  'Entertainment': '#4BC0C0',
  'Bills & Utilities': '#9966FF',
  'Healthcare': '#FF9F40',
  'Education': '#FF6384',
  'Travel': '#C9CBCF',
  'Groceries': '#4BC0C0',
  'Salary': '#36A2EB',
  'Freelance': '#FFCE56',
  'Investment': '#4BC0C0',
  'Business': '#9966FF',
  'Other': '#E7E9ED'
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate total by type
export function calculateTotal(transactions: Transaction[], type: 'INCOME' | 'EXPENSE'): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

// Group transactions by category
export function groupByCategory(transactions: Transaction[]): CategoryData[] {
  const grouped = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
    color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other']
  }));
}

// Filter transactions by date range
export function filterTransactionsByMonth(transactions: Transaction[], date: Date): Transaction[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  return transactions.filter(t => 
    isWithinInterval(new Date(t.date), { start, end })
  );
}

// Calculate budget utilization
export function calculateBudgetUtilization(budgets: Budget[], transactions: Transaction[]): Budget[] {
  return budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent
    };
  });
}

// Generate AI insights based on spending patterns
export function generateAIInsights(
  transactions: Transaction[], 
  budgets: Budget[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  const thisMonth = filterTransactionsByMonth(transactions, new Date());
  const lastMonth = filterTransactionsByMonth(transactions, subMonths(new Date(), 1));
  
  // Check budget overages
  budgets.forEach(budget => {
    const spent = thisMonth
      .filter(t => t.type === 'EXPENSE' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (spent > budget.limit) {
      insights.push({
        id: `budget-${budget.id}`,
        type: 'warning',
        title: `Budget Exceeded: ${budget.category}`,
        description: `You've spent ${formatCurrency(spent)} out of ${formatCurrency(budget.limit)} budget.`,
        category: budget.category,
        impact: 'high'
      });
    } else if (spent > budget.limit * 0.8) {
      insights.push({
        id: `budget-warning-${budget.id}`,
        type: 'warning',
        title: `Approaching Limit: ${budget.category}`,
        description: `You've used ${Math.round((spent / budget.limit) * 100)}% of your ${budget.category} budget.`,
        category: budget.category,
        impact: 'medium'
      });
    }
  });
  
  // Compare with last month
  const thisMonthTotal = calculateTotal(thisMonth, 'EXPENSE');
  const lastMonthTotal = calculateTotal(lastMonth, 'EXPENSE');
  const percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  
  if (percentChange > 20) {
    insights.push({
      id: 'spending-increase',
      type: 'warning',
      title: 'Spending Increased',
      description: `Your spending is ${Math.round(percentChange)}% higher than last month.`,
      impact: 'high'
    });
  } else if (percentChange < -20) {
    insights.push({
      id: 'spending-decrease',
      type: 'success',
      title: 'Great Progress!',
      description: `You've reduced spending by ${Math.abs(Math.round(percentChange))}% compared to last month.`,
      impact: 'high'
    });
  }
  
  // Find highest spending category
  const categoryTotals = groupByCategory(thisMonth.filter(t => t.type === 'EXPENSE'));
  if (categoryTotals.length > 0) {
    const highest = categoryTotals.reduce((max, cat) => 
      cat.amount > max.amount ? cat : max
    );
    
    insights.push({
      id: 'highest-spending',
      type: 'info',
      title: 'Top Spending Category',
      description: `${highest.category} accounts for ${Math.round(highest.percentage)}% of your expenses (${formatCurrency(highest.amount)}).`,
      category: highest.category,
      impact: 'medium'
    });
  }
  
  return insights;
}

// Predict future expenses based on historical data
export function predictFutureExpenses(transactions: Transaction[]): SpendingPattern[] {
  const months = [0, 1, 2].map(i => subMonths(new Date(), i));
  const categoryAverages: Record<string, number[]> = {};
  
  months.forEach(month => {
    const monthTransactions = filterTransactionsByMonth(transactions, month);
    const categories = groupByCategory(monthTransactions.filter(t => t.type === 'EXPENSE'));
    
    categories.forEach(cat => {
      if (!categoryAverages[cat.category]) {
        categoryAverages[cat.category] = [];
      }
      categoryAverages[cat.category].push(cat.amount);
    });
  });
  
  return Object.entries(categoryAverages).map(([category, amounts]) => {
    const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const latest = amounts[0];
    const trend = latest > average * 1.1 ? 'increasing' : 
                  latest < average * 0.9 ? 'decreasing' : 'stable';
    
    // Simple prediction: if increasing, predict 10% more; if decreasing, 10% less
    const prediction = trend === 'increasing' ? average * 1.1 :
                      trend === 'decreasing' ? average * 0.9 : average;
    
    return {
      category,
      trend,
      averageSpending: average,
      prediction: Math.round(prediction)
    };
  });
}

// Generate sample data for demo purposes
export function generateSampleData(): {
  transactions: Transaction[];
  budgets: Budget[];
} {
  const transactions: Transaction[] = [
    // Current month expenses
    { id: '1', type: 'EXPENSE', amount: 5000, category: 'Food & Dining', description: 'Groceries', date: new Date(2025, 10, 5) },
    { id: '2', type: 'EXPENSE', amount: 2000, category: 'Transportation', description: 'Fuel', date: new Date(2025, 10, 8) },
    { id: '3', type: 'EXPENSE', amount: 3500, category: 'Shopping', description: 'Clothing', date: new Date(2025, 10, 10) },
    { id: '4', type: 'EXPENSE', amount: 1500, category: 'Entertainment', description: 'Movies & Dining', date: new Date(2025, 10, 12) },
    { id: '5', type: 'EXPENSE', amount: 4000, category: 'Bills & Utilities', description: 'Electricity & Internet', date: new Date(2025, 10, 1) },
    { id: '6', type: 'EXPENSE', amount: 2500, category: 'Healthcare', description: 'Medical checkup', date: new Date(2025, 10, 7) },
    { id: '7', type: 'INCOME', amount: 50000, category: 'Salary', description: 'Monthly salary', date: new Date(2025, 10, 1) },
    { id: '8', type: 'INCOME', amount: 10000, category: 'Freelance', description: 'Project work', date: new Date(2025, 10, 15) },
    
    // Last month
    { id: '9', type: 'EXPENSE', amount: 4500, category: 'Food & Dining', description: 'Groceries', date: new Date(2025, 9, 5) },
    { id: '10', type: 'EXPENSE', amount: 1800, category: 'Transportation', description: 'Fuel', date: new Date(2025, 9, 8) },
    { id: '11', type: 'EXPENSE', amount: 2000, category: 'Shopping', description: 'Electronics', date: new Date(2025, 9, 10) },
    { id: '12', type: 'INCOME', amount: 50000, category: 'Salary', description: 'Monthly salary', date: new Date(2025, 9, 1) },
  ];
  
  const budgets: Budget[] = [
    { id: 'b1', category: 'Food & Dining', limit: 8000, spent: 0, period: 'monthly' },
    { id: 'b2', category: 'Transportation', limit: 3000, spent: 0, period: 'monthly' },
    { id: 'b3', category: 'Shopping', limit: 5000, spent: 0, period: 'monthly' },
    { id: 'b4', category: 'Entertainment', limit: 3000, spent: 0, period: 'monthly' },
    { id: 'b5', category: 'Bills & Utilities', limit: 5000, spent: 0, period: 'monthly' },
    { id: 'b6', category: 'Healthcare', limit: 4000, spent: 0, period: 'monthly' },
  ];
  
  return { transactions, budgets };
}
