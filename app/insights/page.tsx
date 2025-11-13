'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { 
  generateSampleData, 
  formatCurrency,
  generateAIInsights,
  calculateBudgetUtilization,
  filterTransactionsByMonth,
  predictFutureExpenses,
  groupByCategory
} from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { subMonths, format } from 'date-fns';

export default function InsightsPage() {
  const [data] = useState(() => generateSampleData());
  
  const currentMonthTransactions = useMemo(() => 
    filterTransactionsByMonth(data.transactions, new Date()),
    [data.transactions]
  );
  
  const budgets = useMemo(() => 
    calculateBudgetUtilization(data.budgets, currentMonthTransactions),
    [data.budgets, currentMonthTransactions]
  );
  
  const insights = useMemo(() => 
    generateAIInsights(data.transactions, budgets),
    [data.transactions, budgets]
  );
  
  const predictions = useMemo(() => 
    predictFutureExpenses(data.transactions),
    [data.transactions]
  );
  
  // Generate spending trend data for last 3 months
  const spendingTrend = useMemo(() => {
    return [0, 1, 2].reverse().map(monthsAgo => {
      const date = subMonths(new Date(), monthsAgo);
      const transactions = filterTransactionsByMonth(data.transactions, date);
      const expenses = transactions.filter(t => t.type === 'expense');
      const total = expenses.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: format(date, 'MMM'),
        amount: total
      };
    });
  }, [data.transactions]);
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />;
      case 'success':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={24} />;
      case 'prediction':
        return <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />;
      default:
        return <Info className="text-blue-600 dark:text-blue-400" size={24} />;
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-zinc-500';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="text-red-600 dark:text-red-400" size={18} />;
      case 'decreasing':
        return <TrendingDown className="text-green-600 dark:text-green-400" size={18} />;
      default:
        return <div className="w-5 h-0.5 bg-zinc-400" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="text-purple-600 dark:text-purple-400" size={32} />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            AI Insights
          </h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Intelligent analysis of your spending patterns and personalized recommendations
        </p>
      </div>
      
      {/* Key Insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Lightbulb size={24} className="text-amber-600 dark:text-amber-400" />
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length > 0 ? (
            insights.map(insight => (
              <Card 
                key={insight.id} 
                className={`border-l-4 ${getImpactColor(insight.impact)}`}
              >
                <div className="flex items-start gap-4">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {insight.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                        insight.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      }`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2">
              <div className="text-center py-8">
                <CheckCircle className="mx-auto mb-3 text-green-600 dark:text-green-400" size={48} />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Looking Good! 🎉
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Your spending is on track. Keep up the great work!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Spending Trend */}
      <Card title="Spending Trend" subtitle="Last 3 months" className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Predictions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />
          Expense Predictions
        </h2>
        <Card subtitle="AI-powered predictions for next month">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div 
                key={prediction.category}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 min-w-[140px]">
                      {prediction.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(prediction.trend)}
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {prediction.trend === 'increasing' && 'Trending up'}
                        {prediction.trend === 'decreasing' && 'Trending down'}
                        {prediction.trend === 'stable' && 'Stable'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Avg: {formatCurrency(prediction.averageSpending)}
                  </p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Predicted: {formatCurrency(prediction.prediction)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recommendations */}
      <Card 
        title="Smart Recommendations" 
        subtitle="Personalized tips to improve your finances"
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
            <CheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Set Savings Goals
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Based on your income and expenses, you can save approximately {formatCurrency(10000)} per month. 
                Consider setting up automatic transfers to a savings account.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
            <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Review Subscription Services
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Entertainment expenses are higher than average. Review your subscriptions and cancel those you don't use regularly.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
            <Info className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Track Daily Expenses
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Small daily expenses add up. Try logging every transaction to gain better awareness of your spending habits.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
