'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import { 
  ArrowUpRight, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  Database
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    // Check database health first
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setDbError(data.message || 'Database not configured');
          return;
        }
        
        // Check if user is authenticated
        return fetch('/api/auth/me')
          .then(res => {
            if (res.ok) {
              router.push('/dashboard');
            }
          });
      })
      .catch((error) => {
        console.error('Setup check failed:', error);
        setDbError('Backend not configured. Please run setup.ps1');
      });
  }, [router]);


  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations based on your spending patterns',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level security with encrypted data storage',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Budgeting',
      description: 'Set and track budgets with real-time spending analysis',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Real-time Tracking',
      description: 'Monitor your finances instantly with live updates',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const benefits = [
    'Track income and expenses effortlessly',
    'Create category-based budgets',
    'Get AI-powered spending insights',
    'Visualize your financial data',
    'Secure authentication & data protection',
    'Access from anywhere, anytime'
  ];
  
  return (
    <div className="min-h-screen">
      {/* Database Error Banner */}
      {dbError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  <Database className="inline mr-2" size={20} />
                  Database Setup Required
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                  {dbError}
                </p>
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Quick Setup:</p>
                  <code className="block bg-zinc-100 dark:bg-zinc-900 p-2 rounded">
                    .\setup.ps1
                  </code>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    Or see <a href="/BACKEND_SETUP.md" className="text-blue-600 dark:text-blue-400 underline">BACKEND_SETUP.md</a> for manual setup instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                AI-Powered Financial Management
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Smart Insights,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smarter Decisions
              </span>
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
              Take control of your finances with intelligent budgeting, expense tracking, and AI-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Get Started Free
                <ArrowUpRight size={20} />
              </Link>
              
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-md font-semibold border border-zinc-200 dark:border-zinc-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Everything you need to manage your money
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Powerful features designed to simplify your financial life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Why Choose FinVision AI?
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Our platform combines cutting-edge AI technology with intuitive design to help you make better financial decisions.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                    <p className="text-zinc-700 dark:text-zinc-300 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-blue-100 mb-8">
                Join thousands of users who are already managing their finances smarter with FinVision AI.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <p className="text-blue-50">Create your free account</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <p className="text-blue-50">Add your transactions and budgets</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <p className="text-blue-50">Get AI-powered insights instantly</p>
                </div>
              </div>
              
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-blue-50 transition-all shadow-lg font-semibold"
              >
                Start Your Free Account
                <ArrowUpRight size={20} />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
