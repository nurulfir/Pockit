// Enhanced financial calculations with more detailed scoring

export const calculateFinancialHealthScore = (data) => {
  const { totalIncome, totalExpense, budgetAdherence, savingsRate, hasEmergencyFund } = data;
  
  const breakdown = {
    savingsScore: 0,
    expenseRatioScore: 0,
    budgetScore: 0,
    emergencyFundScore: 0
  };
  
  // 1. Savings Rate (30 points)
  if (savingsRate >= 30) breakdown.savingsScore = 30;
  else if (savingsRate >= 20) breakdown.savingsScore = 25;
  else if (savingsRate >= 10) breakdown.savingsScore = 15;
  else if (savingsRate >= 5) breakdown.savingsScore = 5;

  // 2. Expense Ratio (30 points)
  const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 100;
  if (expenseRatio <= 60) breakdown.expenseRatioScore = 30;
  else if (expenseRatio <= 70) breakdown.expenseRatioScore = 25;
  else if (expenseRatio <= 85) breakdown.expenseRatioScore = 15;
  else if (expenseRatio <= 100) breakdown.expenseRatioScore = 5;

  // 3. Budget Adherence (25 points)
  if (budgetAdherence >= 95) breakdown.budgetScore = 25;
  else if (budgetAdherence >= 90) breakdown.budgetScore = 20;
  else if (budgetAdherence >= 75) breakdown.budgetScore = 12;
  else if (budgetAdherence >= 50) breakdown.budgetScore = 5;

  // 4. Emergency Fund (15 points)
  if (hasEmergencyFund) breakdown.emergencyFundScore = 15;

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    score: Math.min(totalScore, 100),
    breakdown,
    grade: getGrade(totalScore)
  };
};

const getGrade = (score) => {
  if (score >= 90) return { letter: 'A+', label: 'Excellent', color: 'green' };
  if (score >= 80) return { letter: 'A', label: 'Very Good', color: 'green' };
  if (score >= 70) return { letter: 'B+', label: 'Good', color: 'blue' };
  if (score >= 60) return { letter: 'B', label: 'Above Average', color: 'blue' };
  if (score >= 50) return { letter: 'C', label: 'Average', color: 'yellow' };
  if (score >= 40) return { letter: 'D', label: 'Below Average', color: 'orange' };
  return { letter: 'F', label: 'Poor', color: 'red' };
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
  const last3Months = [...Array(3)].map((_, i) => {
    const month = new Date().getMonth() - i - 1;
    return transactions
      .filter(t => t.month === month && t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  return last3Months.reduce((a, b) => a + b, 0) / last3Months.length;
};