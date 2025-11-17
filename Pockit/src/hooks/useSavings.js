import { useState, useEffect } from 'react';
import { savingsService } from '../services/savingsService';

export const useSavings = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const data = await savingsService.getGoals();
    setGoals(data);
    setLoading(false);
  };

  const addGoal = async (goal) => {
    const newGoal = await savingsService.addGoal(goal);
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const addToGoal = async (id, amount) => {
    const updated = await savingsService.updateGoalProgress(id, amount);
    if (updated) {
      setGoals(goals.map(g => g.id === id ? updated : g));
    }
    return updated;
  };

  const deleteGoal = async (id) => {
    await savingsService.deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const getActiveGoals = () => {
    return goals.filter(g => g.status === 'active');
  };

  const getCompletedGoals = () => {
    return goals.filter(g => g.status === 'completed');
  };

  return {
    goals,
    loading,
    addGoal,
    addToGoal,
    deleteGoal,
    getActiveGoals,
    getCompletedGoals
  };
};