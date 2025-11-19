import { motion } from 'framer-motion';
import { Lightbulb, Star, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Great job! No recommendations at the moment.</p>
      </div>
    );
  }

  const priorityColors = {
    high: 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700',
    medium: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700',
    low: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
  };

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🔵'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Smart Recommendations
        </h2>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`border-2 rounded-xl p-5 ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{priorityIcons[rec.priority]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    {rec.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {rec.description}
                </p>
                <div className="bg-white/70 dark:bg-black/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Action: {rec.action}
                      </p>
                      {rec.potentialSaving && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                          Potential saving: {formatCurrency(rec.potentialSaving)}/month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};