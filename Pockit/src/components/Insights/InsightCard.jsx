import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, TrendingUp, Lightbulb } from 'lucide-react';

export const InsightCard = ({ insight, onAction }) => {
  const icons = {
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
    success: CheckCircle
  };

  const colors = {
    error: 'from-red-500 to-red-600',
    warning: 'from-yellow-500 to-yellow-600',
    info: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600'
  };

  const Icon = icons[insight.severity] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gradient-to-br ${colors[insight.severity]} rounded-xl p-5 text-white shadow-lg cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
          <p className="text-sm opacity-90 mb-3">{insight.description}</p>
          {insight.recommendation && (
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{insight.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};