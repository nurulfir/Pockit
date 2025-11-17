// Advanced financial calculations

export const calculateFinancialHealthScore = (data) => {
  const {
    totalIncome,
    totalExpense,
    budgetAdherence, // % transaksi yang sesuai budget
    savingsRate, // % income yang ditabung
    hasEmergencyFund
  } = data;

  let score = 0;

  // 1. Savings Rate (30 points)
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 5) score += 10;

  // 2. Expense Ratio (30 points)
  const expenseRatio = (totalExpense / totalIncome) * 100;
  if (expenseRatio <= 70) score += 30;
  else if (expenseRatio <= 85) score += 20;
  else if (expenseRatio <= 100) score += 10;

  // 3. Budget Adherence (25 points)
  if (budgetAdherence >= 90) score += 25;
  else if (budgetAdherence >= 75) score += 15;
  else if (budgetAdherence >= 50) score += 5;

  // 4. Emergency Fund (15 points)
  if (hasEmergencyFund) score += 15;

  return Math.min(score, 100);
};

export const calculateSavingsRate = (income, expense) => {
  if (income === 0) return 0;
  return ((income - expense) / income) * 100;
};

export const calculateBudgetAdherence = (budgets, expenses) => {
  if (!budgets || budgets.length === 0) return 100;
  
  const adherentCategories = budgets.filter(budget => {
    const spent = expenses[budget.category] || 0;
    return spent <= budget.amount;
  });

  return (adherentCategories.length / budgets.length) * 100;
};

export const predictNextMonthExpense = (transactions) => {
  // Simple moving average of last 3 months
  const last3Months = [...Array(3)].map((_, i) => {
    const month = new Date().getMonth() - i - 1;
    return transactions
      .filter(t => t.month === month && t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  return last3Months.reduce((a, b) => a + b, 0) / last3Months.length;
};