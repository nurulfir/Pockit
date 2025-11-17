import { Heart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { HEALTH_SCORE_CONFIG } from '../../utils/constants';

export const FinancialHealthScore = ({ score, insights }) => {
  const getScoreLevel = (score) => {
    if (score >= 80) return HEALTH_SCORE_CONFIG.EXCELLENT;
    if (score >= 60) return HEALTH_SCORE_CONFIG.GOOD;
    if (score >= 40) return HEALTH_SCORE_CONFIG.FAIR;
    return HEALTH_SCORE_CONFIG.POOR;
  };

  const level = getScoreLevel(score);
  const colorClasses = {
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[level.color]} rounded-2xl p-6 text-white shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold opacity-90">Financial Health Score</h3>
            <p className="text-sm opacity-75">{level.label}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">{score}</div>
          <div className="text-sm opacity-75">/100</div>
        </div>
      </div>

      <div className="bg-white bg-opacity-20 rounded-lg h-3 mb-4 overflow-hidden">
        <div 
          className="bg-white h-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            {insight.type === 'success' ? (
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <span className="opacity-90">{insight.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};