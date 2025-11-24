'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Wallet, 
  PiggyBank,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, transactionsRes, budgetsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/transactions'),
        fetch('/api/budgets'),
      ]);

      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      
      // Handle transactions response
      let transactionsData = { transactions: [] };
      if (transactionsRes.ok) {
        try {
          transactionsData = await transactionsRes.json();
        } catch (e) {
          console.error('Failed to parse transactions:', e);
        }
      }

      // Handle budgets response
      let budgetsData = { budgets: [] };
      if (budgetsRes.ok) {
        try {
          budgetsData = await budgetsRes.json();
        } catch (e) {
          console.error('Failed to parse budgets:', e);
        }
      }

      setUser(userData.user);
      setTransactions(transactionsData.transactions || []);
      setBudgets(budgetsData.budgets || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, []);

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Total Income
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ArrowUpRight className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalExpense)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ArrowDownRight className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Balance
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {transactions.length === 0 && budgets.length === 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Get Started
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Start by adding your first transaction in the Expenses page or set up a budget in the Budget page.
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {(expensesByCategory.length > 0 || budgets.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expense Breakdown */}
          {expensesByCategory.length > 0 && (
            <Card title="Expense Breakdown" subtitle="By category">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => entry.category}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expensesByCategory.map((entry, index) => {
                      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
          
          {/* Budget Overview */}
          {budgets.length > 0 && (
            <Card title="Budget Overview" subtitle="Category-wise spending">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                  <Bar dataKey="limit" fill="#e5e7eb" name="Budget" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
      
      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card title="Recent Transactions" subtitle="Latest 5 transactions">
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                    ) : (
                      <PiggyBank className="text-red-600 dark:text-red-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'INCOME' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
