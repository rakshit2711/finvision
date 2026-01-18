'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { PiggyBank, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/lib/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'MONTHLY',
  });

  // Fetch budgets from API
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/budgets');
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch budgets');
      }

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budgets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          limit: parseFloat(formData.limit),
          period: formData.period,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create budget');
      }

      // Refresh budgets
      await fetchBudgets();
      
      // Reset form
      setShowAddForm(false);
      setFormData({ category: '', limit: '', period: 'MONTHLY' });
    } catch (err: any) {
      console.error('Error creating budget:', err);
      setError(err.message || 'Failed to create budget. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets?id=${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      // Refresh budgets
      await fetchBudgets();
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget. Please try again.');
    }
  };
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const getBarColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-600 dark:text-zinc-400">Loading budgets...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="text-purple-600 dark:text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Budget Management
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Set and track your spending limits by category
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} className="mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Add Budget Form */}
      {showAddForm && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  disabled={submitting}
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <Input
                type="number"
                label="Monthly Limit (₹)"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                required
                disabled={submitting}
              />

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Period
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  required
                  disabled={submitting}
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Creating...' : 'Add Budget'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Overall Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Budget
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalBudget)}
          </p>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {utilizationPercentage.toFixed(1)}% utilized
          </p>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Remaining
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(remainingBudget)}
          </p>
        </Card>
      </div>

      {/* No Budgets Message */}
      {budgets.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <PiggyBank className="mx-auto text-zinc-400 dark:text-zinc-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No budgets yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Create your first budget to start tracking your spending limits
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={20} className="mr-2" />
              Create Budget
            </Button>
          </div>
        </Card>
      )}
      
      {/* Budget Visualization */}
      {budgets.length > 0 && (
        <>
          <Card title="Budget Overview" subtitle="Spending vs. Limits" className="mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={budgets} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={150} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="limit" fill="#e5e7eb" name="Budget" radius={[0, 8, 8, 0]} />
            <Bar dataKey="spent" name="Spent" radius={[0, 8, 8, 0]}>
              {budgets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.spent, entry.limit)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Detailed Budget List */}
      <Card title="Budget Details" subtitle="Category-wise breakdown">
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage >= 100;
            const isNearLimit = percentage >= 80 && percentage < 100;
            
            return (
              <div 
                key={budget.id}
                className={`p-5 rounded-lg border-2 ${
                  isOverBudget 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                    : isNearLimit
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {budget.category}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      <span className="ml-2 text-xs">({budget.period})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                      isOverBudget 
                        ? 'bg-red-500' 
                        : isNearLimit
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium ${
                    isOverBudget 
                      ? 'text-red-600 dark:text-red-400' 
                      : isNearLimit
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(budget.limit - budget.spent)} remaining
                  </span>
                </div>
                
                {isOverBudget && (
                  <div className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">
                      Over budget by {formatCurrency(budget.spent - budget.limit)}
                    </span>
                  </div>
                )}
                
                {isNearLimit && !isOverBudget && (
                  <div className="flex items-center gap-2 mt-3 text-amber-600 dark:text-amber-400">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">
                      Approaching limit
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
        </>
      )}
    </div>
  );
}
