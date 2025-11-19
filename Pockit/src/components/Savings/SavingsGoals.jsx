import { useState } from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { GoalCard } from './GoalCard';
import { formatCurrency } from '../../utils/formatters';

export const SavingsGoals = ({ goals, onAdd, onAddToGoal, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    icon: '🎯'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount) {
      alert('Mohon isi nama dan target!');
      return;
    }

    onAdd({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    });

    setFormData({ name: '', targetAmount: '', deadline: '', icon: '🎯' });
    setShowForm(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Savings Goals</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6 border-2 border-purple-200 dark:border-purple-700">
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Goal name (e.g., Laptop Baru)"
              className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              placeholder="Target amount"
              className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Belum ada goals. Mulai nabung untuk impianmu!
        </p>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Active Goals</h3>
              <div className="space-y-4">
                {activeGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onAddToGoal={onAddToGoal}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Completed Goals 🎉
              </h3>
              <div className="space-y-4">
                {completedGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
