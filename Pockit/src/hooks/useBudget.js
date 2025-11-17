import { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';

export const useBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    const data = await budgetService.getBudgets();
    setBudgets(data);
    setLoading(false);
  };

  const addBudget = async (budget) => {
    const newBudget = await budgetService.addBudget(budget);
    setBudgets([...budgets, newBudget]);
    return newBudget;
  };

  const updateBudget = async (id, updates) => {
    const updated = await budgetService.updateBudget(id, updates);
    if (updated) {
      setBudgets(budgets.map(b => b.id === id ? updated : b));
    }
    return updated;
  };

  const deleteBudget = async (id) => {
    await budgetService.deleteBudget(id);
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const getBudgetStatus = (category, spent) => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return null;

    const percentage = (spent / budget.amount) * 100;
    
    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
    };
  };

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus
  };
};