'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Plus, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { generateSampleData, formatCurrency, groupByCategory, CATEGORY_COLORS } from '@/lib/utils';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ExpensesPage() {
  const [data] = useState(() => generateSampleData());
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const filteredTransactions = useMemo(() => {
    let filtered = data.transactions;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.transactions, filterType, searchQuery]);
  
  const expenseData = useMemo(() => 
    groupByCategory(filteredTransactions.filter(t => t.type === 'expense')),
    [filteredTransactions]
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    console.log('Form submitted:', formData);
    setShowAddForm(false);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
  };
  
  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Expenses & Income
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track and manage all your transactions
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} className="mr-2" />
          Add Transaction
        </Button>
      </div>
      
      {/* Add Transaction Form */}
      {showAddForm && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'primary' : 'outline'}
                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                    className="flex-1"
                  >
                    <TrendingDown size={18} className="mr-2" />
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'primary' : 'outline'}
                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                    className="flex-1"
                  >
                    <TrendingUp size={18} className="mr-2" />
                    Income
                  </Button>
                </div>
              </div>
              
              <Input
                type="number"
                label="Amount (₹)"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <Input
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <Input
              type="text"
              label="Description"
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Transaction
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Category Breakdown */}
        <Card title="Expense Distribution" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="amount"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {expenseData.map(item => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">{item.category}</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Transactions List */}
        <Card title="All Transactions" className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'income' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('income')}
              >
                Income
              </Button>
              <Button
                variant={filterType === 'expense' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('expense')}
              >
                Expenses
              </Button>
            </div>
          </div>
          
          {/* Transaction List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[transaction.category] }}
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No transactions found
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
