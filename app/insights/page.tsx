'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/Card';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Lightbulb,
  BarChart3,
  Loader2
} from 'lucide-react';
import { 
  formatCurrency
} from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { subMonths, format } from 'date-fns';

// AI Insights API types
interface SpendingPattern {
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentage: number;
}

interface BudgetRecommendation {
  category: string;
  recommendedAmount: number;
  currentSpending: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnomalyDetection {
  transactionId: string;
  amount: number;
  category: string;
  date: string;
  anomalyScore: number;
  reason: string;
}

interface CategoryHealth {
  category: string;
  status: 'good' | 'warning' | 'bad';
  reason: string;
  spending: number;
  recommendation: string;
}

interface IncomeVsExpense {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  status: 'healthy' | 'concerning' | 'critical';
}

interface AIInsightsResponse {
  userId: string;
  incomeVsExpense: IncomeVsExpense;
  spendingPatterns: SpendingPattern[];
  categoryHealth: CategoryHealth[];
  budgetRecommendations: BudgetRecommendation[];
  anomalies: AnomalyDetection[];
  totalSpending: number;
  averageDailySpending: number;
  projectedMonthlySpending: number;
  savingsOpportunities: string[];
}

// Prediction API types
interface MonthlyPrediction {
  month: string;
  predicted_income?: number;
  predicted_expenditure?: number;
  linear_prediction?: number;
  rf_prediction?: number;
  confidence_interval?: {
    lower: number;
    upper: number;
  };
  amount?: number;
}

interface CategoryExpenditurePrediction {
  predictions: MonthlyPrediction[];
  historical_average: number;
  predicted_average: number;
  total_predicted: number;
  trend: string;
}

interface IncomePrediction {
  predictions: MonthlyPrediction[];
  historical_average: number;
  predicted_average: number;
  growth_trend: number;
  total_predicted_income: number;
  confidence_score: number;
  insights: string[];
  sample_data_used: boolean;
}

interface ExpenditurePrediction {
  category_predictions?: {
    [key: string]: CategoryExpenditurePrediction;
  };
  overall_predictions: {
    month: string;
    total_expenditure: number;
  }[];
  historical_average_total: number;
  predicted_average_total: number;
  total_predicted_expenditure: number;
  insights: string[];
  confidence_score: number;
  sample_data_used: boolean;
}

export default function InsightsPage() {
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [incomePrediction, setIncomePrediction] = useState<IncomePrediction | null>(null);
  const [expenditurePrediction, setExpenditurePrediction] = useState<ExpenditurePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserId(data.user.id);
        } else {
          setError('Please log in to view insights');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    }
    fetchUser();
  }, []);
  
  // Fetch AI insights when userId is available
  useEffect(() => {
    async function fetchInsights() {
      if (!userId) return;
      
      try {
        setLoading(true);
        const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
        const res = await fetch(`${aiServiceUrl}/api/v1/insights/user/${userId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch insights from AI service');
        }
        
        const data = await res.json();
        setAiInsights(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching AI insights:', err);
        setError('Failed to load AI insights. Make sure the AI service is running.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInsights();
  }, [userId]);

  // Fetch income and expenditure predictions
  useEffect(() => {
    async function fetchPredictions() {
      if (!userId) return;
      
      try {
        setPredictionsLoading(true);
        const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
        
        // Fetch both predictions in parallel
        const [incomeRes, expenditureRes] = await Promise.all([
          fetch(`${aiServiceUrl}/api/v1/predictions/income`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: userId,
              forecast_months: 3,
              use_sample_data: true
            })
          }),
          fetch(`${aiServiceUrl}/api/v1/predictions/expenditure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: userId,
              forecast_months: 3,
              by_category: true,
              use_sample_data: true
            })
          })
        ]);
        
        if (incomeRes.ok) {
          const incomeData = await incomeRes.json();
          setIncomePrediction(incomeData);
        }
        
        if (expenditureRes.ok) {
          const expenditureData = await expenditureRes.json();
          setExpenditurePrediction(expenditureData);
        }
      } catch (err) {
        console.error('Error fetching predictions:', err);
      } finally {
        setPredictionsLoading(false);
      }
    }
    
    fetchPredictions();
  }, [userId]);
  
  // Convert AI insights to display format
  const insights = useMemo(() => {
    if (!aiInsights) return [];
    
    const result: Array<{
      id: string;
      type: 'warning' | 'success' | 'prediction' | 'info';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
    }> = [];
    
    // Add budget recommendations as insights
    aiInsights.budgetRecommendations.forEach((rec, idx) => {
      if (rec.priority === 'high' || rec.priority === 'medium') {
        result.push({
          id: `budget-${idx}`,
          type: 'warning',
          title: `${rec.category} Budget Alert`,
          description: rec.reason,
          impact: rec.priority as 'high' | 'medium' | 'low'
        });
      }
    });
    
    // Add anomalies as insights
    aiInsights.anomalies.slice(0, 3).forEach((anomaly, idx) => {
      result.push({
        id: `anomaly-${idx}`,
        type: 'warning',
        title: `Unusual ${anomaly.category} Transaction`,
        description: anomaly.reason,
        impact: 'medium'
      });
    });
    
    return result;
  }, [aiInsights]);
  
  // Generate spending trend data
  const spendingTrend = useMemo(() => {
    if (!aiInsights || !aiInsights.spendingPatterns.length) return [];
    
    // Create simple trend based on patterns
    const currentSpending = aiInsights.totalSpending;
    const avgSpending = aiInsights.averageDailySpending * 30;
    
    return [
      { month: format(subMonths(new Date(), 2), 'MMM'), amount: avgSpending * 0.9 },
      { month: format(subMonths(new Date(), 1), 'MMM'), amount: avgSpending * 0.95 },
      { month: format(new Date(), 'MMM'), amount: currentSpending }
    ];
  }, [aiInsights]);
  
  // Generate predictions from spending patterns
  const predictions = useMemo(() => {
    if (!aiInsights || !aiInsights.spendingPatterns.length) return [];
    
    return aiInsights.spendingPatterns.map(pattern => ({
      category: pattern.category,
      averageSpending: pattern.averageAmount,
      prediction: pattern.averageAmount * pattern.transactionCount * 1.05,
      trend: pattern.percentage > 20 ? 'increasing' : 'stable'
    }));
  }, [aiInsights]);
  
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
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 mb-4" size={48} />
          <p className="text-zinc-600 dark:text-zinc-400">Loading AI insights...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Error Loading Insights</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Make sure the AI insights service is running on port 8000.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!aiInsights) {
    return null;
  }
  
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
      
      {/* AI Predictions Section */}
      {(incomePrediction || expenditurePrediction) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Income Prediction Card */}
          {incomePrediction && (
            <Card 
              title="Income Prediction" 
              subtitle={`Next ${incomePrediction.predictions.length} months forecast • ${(incomePrediction.confidence_score * 100).toFixed(0)}% confidence`}
              className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Historical Average</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(incomePrediction.historical_average)}
                    </p>
                  </div>
                  <TrendingUp className={`${
                    incomePrediction.growth_trend > 0 ? 'text-green-600 dark:text-green-400' :
                    incomePrediction.growth_trend < 0 ? 'text-red-600 dark:text-red-400' :
                    'text-zinc-600 dark:text-zinc-400'
                  }`} size={32} />
                </div>
                
                <div className="pt-4 border-t border-green-200 dark:border-green-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Predicted Average</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(incomePrediction.predicted_average)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Total Predicted: {formatCurrency(incomePrediction.total_predicted_income)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Growth Trend: {incomePrediction.growth_trend > 0 ? '+' : ''}{incomePrediction.growth_trend.toFixed(1)}%
                  </p>
                </div>

                {incomePrediction.insights.length > 0 && (
                  <div className="pt-4 border-t border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Insights:</p>
                    <ul className="space-y-2">
                      {incomePrediction.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Expenditure Prediction Card */}
          {expenditurePrediction && (
            <Card 
              title="Expenditure Prediction" 
              subtitle={`Next ${expenditurePrediction.overall_predictions.length} months forecast • ${(expenditurePrediction.confidence_score * 100).toFixed(0)}% confidence`}
              className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Historical Average</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(expenditurePrediction.historical_average_total)}
                    </p>
                  </div>
                  <TrendingDown className="text-red-600 dark:text-red-400" size={32} />
                </div>
                
                <div className="pt-4 border-t border-red-200 dark:border-red-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Predicted Average</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(expenditurePrediction.predicted_average_total)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Total Predicted: {formatCurrency(expenditurePrediction.total_predicted_expenditure)}
                  </p>
                </div>

                {expenditurePrediction.insights.length > 0 && (
                  <div className="pt-4 border-t border-red-200 dark:border-red-800">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Insights:</p>
                    <ul className="space-y-2">
                      {expenditurePrediction.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Category-wise Expenditure Predictions */}
      {expenditurePrediction && expenditurePrediction.category_predictions && Object.keys(expenditurePrediction.category_predictions).length > 0 && (
        <Card 
          title="Category-wise Predictions" 
          subtitle="Expenditure forecast by category"
          className="mb-8"
        >
          <div className="space-y-3">
            {Object.entries(expenditurePrediction.category_predictions).map(([category, catPred]) => (
              <div 
                key={category}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize min-w-[120px]">
                    {category}
                  </span>
                  <div className="flex items-center gap-2">
                    {catPred.trend === 'increasing' ? (
                      <TrendingUp className="text-red-600 dark:text-red-400" size={16} />
                    ) : catPred.trend === 'decreasing' ? (
                      <TrendingDown className="text-green-600 dark:text-green-400" size={16} />
                    ) : (
                      <div className="w-4 h-0.5 bg-zinc-400" />
                    )}
                    <span className={`text-sm font-medium capitalize ${
                      catPred.trend === 'increasing' ? 'text-red-600 dark:text-red-400' :
                      catPred.trend === 'decreasing' ? 'text-green-600 dark:text-green-400' :
                      'text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {catPred.trend}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Avg: {formatCurrency(catPred.historical_average)}
                  </p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Predicted: {formatCurrency(catPred.total_predicted)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3-Month Forecast Chart */}
      {(incomePrediction || expenditurePrediction) && (
        <Card 
          title="Multi-Month Forecast" 
          subtitle="Income vs Expenditure predictions"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              {incomePrediction && (
                <Line 
                  data={incomePrediction.predictions}
                  type="monotone" 
                  dataKey="predicted_income" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                  name="Predicted Income"
                />
              )}
              {expenditurePrediction && (
                <Line 
                  data={expenditurePrediction.overall_predictions}
                  type="monotone" 
                  dataKey="total_expenditure" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 6 }}
                  name="Predicted Expenditure"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Income vs Expense Comparison */}
      <Card 
        title="Income vs Expense" 
        subtitle="Your financial overview"
        className={`mb-8 border-l-4 ${
          aiInsights.incomeVsExpense.status === 'healthy' ? 'border-l-green-500' :
          aiInsights.incomeVsExpense.status === 'concerning' ? 'border-l-amber-500' :
          'border-l-red-500'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(aiInsights.incomeVsExpense.totalIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(aiInsights.incomeVsExpense.totalExpense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${
              aiInsights.incomeVsExpense.netBalance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(aiInsights.incomeVsExpense.netBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Savings Rate</p>
            <p className={`text-2xl font-bold ${
              aiInsights.incomeVsExpense.savingsRate >= 20 ? 'text-green-600 dark:text-green-400' :
              aiInsights.incomeVsExpense.savingsRate >= 10 ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {aiInsights.incomeVsExpense.savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className={`flex items-center gap-2 ${
            aiInsights.incomeVsExpense.status === 'healthy' ? 'text-green-600 dark:text-green-400' :
            aiInsights.incomeVsExpense.status === 'concerning' ? 'text-amber-600 dark:text-amber-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {aiInsights.incomeVsExpense.status === 'healthy' ? <CheckCircle size={20} /> :
             aiInsights.incomeVsExpense.status === 'concerning' ? <AlertTriangle size={20} /> :
             <AlertTriangle size={20} />}
            <span className="font-semibold capitalize">{aiInsights.incomeVsExpense.status} Financial Status</span>
          </div>
        </div>
      </Card>

      {/* Category Health Assessment */}
      {aiInsights.categoryHealth.length > 0 && (
        <Card title="Category Health" subtitle="AI assessment of your spending categories" className="mb-8">
          <div className="space-y-4">
            {aiInsights.categoryHealth.map((health) => (
              <div 
                key={health.category}
                className={`p-4 rounded-lg border-l-4 ${
                  health.status === 'good' ? 'bg-green-50 dark:bg-green-900/10 border-l-green-500' :
                  health.status === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-l-amber-500' :
                  'bg-red-50 dark:bg-red-900/10 border-l-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {health.status === 'good' ? <CheckCircle className="text-green-600 dark:text-green-400" size={24} /> :
                       health.status === 'warning' ? <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} /> :
                       <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />}
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize text-lg">
                        {health.category}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                        health.status === 'good' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        health.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {health.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {health.reason}
                    </p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      💡 {health.recommendation}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Spent</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(health.spending)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
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
      
      {/* Savings Opportunities */}
      <Card 
        title="Savings Opportunities" 
        subtitle="AI-powered recommendations to save money"
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10"
      >
        <div className="space-y-4">
          {aiInsights.savingsOpportunities.map((opportunity, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
              <Lightbulb className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {opportunity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Spending by Category */}
      {aiInsights.spendingPatterns.length > 0 && (
        <Card title="Spending by Category" subtitle="Your expense breakdown" className="mt-8">
          <div className="space-y-4">
            {aiInsights.spendingPatterns.map((pattern) => (
              <div key={pattern.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                    {pattern.category}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(pattern.totalAmount)} ({pattern.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(pattern.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {pattern.transactionCount} transactions • Avg: {formatCurrency(pattern.averageAmount)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
