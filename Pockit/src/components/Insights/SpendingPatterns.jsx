import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { InsightCard } from './InsightCard';

export const SpendingPatterns = ({ patterns }) => {
  if (!patterns || patterns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No patterns detected yet. Keep tracking your expenses!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Spending Patterns
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map((pattern, index) => (
          <InsightCard key={index} insight={pattern} />
        ))}
      </div>
    </div>
  );
};