import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Trophy } from 'lucide-react';
import { generateInsights } from '../../ai/insightsEngine';
import { SpendingPatterns } from './SpendingPatterns';
import { Recommendations } from './Recommendations';
import { LoadingSkeleton } from '../Shared/LoadingSkeleton';

export const InsightsDashboard = ({ transactions, budgets, goals, bills }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing time for better UX
    setLoading(true);
    setTimeout(() => {
      const generated = generateInsights(transactions, budgets, goals, bills);
      setInsights(generated);
      setLoading(false);
    }, 1000);
  }, [transactions, budgets, goals, bills]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI Financial Assistant</h1>
        </div>
        <p className="text-purple-100">
          Personalized insights and recommendations powered by smart analysis
        </p>
      </motion.div>

      {/* Positive Habits */}
      {insights.positiveHabits && insights.positiveHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Your Achievements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.positiveHabits.map((habit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                         rounded-xl p-4 border-2 border-green-200 dark:border-green-700"
              >
                <div className="text-3xl mb-2">{habit.emoji}</div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {habit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {habit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Alerts */}
      {insights.alerts && insights.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-red-300 dark:border-red-700"
        >
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            ⚠️ Urgent Alerts
          </h2>
          <div className="space-y-3">
            {insights.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  alert.severity === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                }`}
              >
                <h3 className="font-bold text-gray-800 dark:text-gray-200">
                  {alert.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Predictions */}
      {insights.predictions.nextMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Next Month Prediction
            </h2>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 
                        rounded-xl p-5 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Predicted Spending
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  Rp {insights.predictions.nextMonth.amount.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Confidence: {insights.predictions.nextMonth.confidence}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  insights.predictions.nextMonth.trend === 'increasing'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {insights.predictions.nextMonth.trend === 'increasing' ? '📈' : '📉'}{' '}
                  {insights.predictions.nextMonth.trendPercentage}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  vs last month
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spending Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <SpendingPatterns patterns={insights.patterns} />
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <Recommendations recommendations={insights.recommendations} />
      </motion.div>
    </div>
  );
};