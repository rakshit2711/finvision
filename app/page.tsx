'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Wallet, 
  PiggyBank,
  AlertCircle 
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
import { 
  generateSampleData, 
  calculateTotal, 
  groupByCategory, 
  formatCurrency,
  filterTransactionsByMonth,
  calculateBudgetUtilization,
  generateAIInsights
} from '@/lib/utils';
import { format } from 'date-fns';

export default function Home() {
  const [data] = useState(() => generateSampleData());
  
  const currentMonthTransactions = useMemo(() => 
    filterTransactionsByMonth(data.transactions, new Date()),
    [data.transactions]
  );
  
  const totalIncome = useMemo(() => 
    calculateTotal(currentMonthTransactions, 'income'),
    [currentMonthTransactions]
  );
  
  const totalExpense = useMemo(() => 
    calculateTotal(currentMonthTransactions, 'expense'),
    [currentMonthTransactions]
  );
  
  const balance = totalIncome - totalExpense;
  
  const expensesByCategory = useMemo(() => 
    groupByCategory(currentMonthTransactions.filter(t => t.type === 'expense')),
    [currentMonthTransactions]
  );
  
  const budgets = useMemo(() => 
    calculateBudgetUtilization(data.budgets, currentMonthTransactions),
    [data.budgets, currentMonthTransactions]
  );
  
  const insights = useMemo(() => 
    generateAIInsights(data.transactions, budgets),
    [data.transactions, budgets]
  );
  
  const recentTransactions = currentMonthTransactions.slice(0, 5);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Welcome back! 👋
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
      
      {/* AI Insights Alert */}
      {insights.length > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                AI Insights ({insights.length})
              </h3>
              <div className="space-y-2">
                {insights.slice(0, 2).map(insight => (
                  <div key={insight.id} className="text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium">{insight.title}:</span> {insight.description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expense Breakdown */}
        <Card title="Expense Breakdown" subtitle="By category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.category} (${props.percentage.toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Budget Overview */}
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
      </div>
      
      {/* Recent Transactions */}
      <Card title="Recent Transactions" subtitle="Latest 5 transactions">
        <div className="space-y-4">
          {recentTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {transaction.type === 'income' ? (
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
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
