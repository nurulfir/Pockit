import { motion } from 'framer-motion';
import { Heart, TrendingUp, Shield, PiggyBank, Target } from 'lucide-react';

export const FinancialHealthDetailed = ({ healthData, insights }) => {
  const { score, breakdown, grade } = healthData;

  const colorClasses = {
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600',
    yellow: 'from-yellow-400 to-yellow-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600'
  };

  const metrics = [
    { name: 'Savings Rate', score: breakdown.savingsScore, max: 30, icon: PiggyBank, color: 'green' },
    { name: 'Expense Control', score: breakdown.expenseRatioScore, max: 30, icon: TrendingUp, color: 'blue' },
    { name: 'Budget Discipline', score: breakdown.budgetScore, max: 25, icon: Target, color: 'purple' },
    { name: 'Emergency Fund', score: breakdown.emergencyFundScore, max: 15, icon: Shield, color: 'yellow' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colorClasses[grade.color]} 
      rounded-2xl p-6 text-white shadow-2xl 
      w-full h-full`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold opacity-90">Financial Health</h3>
            <p className="text-sm opacity-75">{grade.label}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold">{grade.letter}</div>
          <div className="text-2xl font-semibold">{score}/100</div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/20 rounded-lg h-4 mb-6 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className="bg-white h-full"
        />
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <span className="text-sm font-bold">
                {metric.score}/{metric.max}
              </span>
            </div>

            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.score / metric.max) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white h-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      {insights?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h4 className="text-sm font-semibold mb-3 opacity-90">Key Insights</h4>
          <div className="space-y-2">
            {insights.slice(0, 2).map((insight, i) => (
              <div key={i} className="text-sm opacity-80 flex items-start gap-2">
                <span>{insight.type === 'success' ? '✓' : '!'}</span>
                <span>{insight.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
