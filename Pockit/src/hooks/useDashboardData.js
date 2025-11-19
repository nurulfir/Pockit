import { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  calculateFinancialHealthScore, 
  calculateSavingsRate, 
  calculateBudgetAdherence 
} from '../utils/calculations';

export const useDashboardData = (selectedMonth) => {
  const { transactions, budget } = useAppContext();

  const filteredTransactions = useMemo(() => {
    return transactions.getFilteredTransactions(selectedMonth);
  }, [transactions, selectedMonth]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.calculateTotals(selectedMonth);
  }, [transactions, selectedMonth]);

  const expenseByCategory = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  }, [filteredTransactions]);

  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
  const budgetAdherence = calculateBudgetAdherence(budget.budgets, expenseByCategory);
  const hasEmergencyFund = balance >= totalExpense * 3;

  const healthData = calculateFinancialHealthScore({
    totalIncome,
    totalExpense,
    budgetAdherence,
    savingsRate,
    hasEmergencyFund
  });

  // AI Insights
  const insights = useMemo(() => {
    const result = [];
    if (savingsRate >= 20) result.push({ type: 'success', message: 'Great savings rate! You\'re saving 20%+ of your income.' });
    else if (savingsRate < 5) result.push({ type: 'warning', message: 'Try to save at least 10% of your income.' });

    if (budgetAdherence >= 90) result.push({ type: 'success', message: 'Excellent budget discipline!' });
    else if (budgetAdherence < 50) result.push({ type: 'warning', message: 'You\'re exceeding many budgets.' });

    if (hasEmergencyFund) result.push({ type: 'success', message: 'You have a solid emergency fund!' });
    else result.push({ type: 'warning', message: 'Build an emergency fund (3 months of expenses).' });

    return result;
  }, [savingsRate, budgetAdherence, hasEmergencyFund]);

  return {
    filteredTransactions,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    savingsRate,
    budgetAdherence,
    hasEmergencyFund,
    healthData,
    insights
  };
};