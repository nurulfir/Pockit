/**
 * Predict next month's spending based on historical data
 */
export const predictNextMonthSpending = (transactions) => {
  if (transactions.length === 0) return null;

  // Get last 3 months of spending
  const currentMonth = new Date().getMonth();
  const last3Months = [0, 1, 2].map(i => {
    const month = (currentMonth - i - 1 + 12) % 12;
    return transactions
      .filter(t => t.month === month && t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  if (last3Months.filter(m => m > 0).length === 0) {
    return null;
  }

  // Simple moving average
  const average = last3Months.reduce((a, b) => a + b, 0) / last3Months.filter(m => m > 0).length;

  // Calculate trend (increasing/decreasing)
  const trend = last3Months[0] > last3Months[1] ? 'increasing' : 'decreasing';
  const trendPercentage = last3Months[1] > 0 
    ? ((last3Months[0] - last3Months[1]) / last3Months[1]) * 100 
    : 0;

  // Adjust prediction based on trend
  let prediction = average;
  if (Math.abs(trendPercentage) > 10) {
    prediction = average * (1 + (trendPercentage / 100) * 0.5); // 50% weight on trend
  }

  return {
    amount: Math.round(prediction),
    confidence: last3Months.filter(m => m > 0).length >= 2 ? 'high' : 'low',
    trend,
    trendPercentage: Math.round(Math.abs(trendPercentage)),
    historical: last3Months.filter(m => m > 0)
  };
};

/**
 * Predict category-wise spending
 */
export const predictCategorySpending = (transactions) => {
  const currentMonth = new Date().getMonth();
  const predictions = {};

  // Get unique categories
  const categories = [...new Set(transactions.filter(t => t.type === 'pengeluaran').map(t => t.category))];

  categories.forEach(category => {
    const last3Months = [0, 1, 2].map(i => {
      const month = (currentMonth - i - 1 + 12) % 12;
      return transactions
        .filter(t => t.month === month && t.type === 'pengeluaran' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const validMonths = last3Months.filter(m => m > 0);
    if (validMonths.length > 0) {
      const average = validMonths.reduce((a, b) => a + b, 0) / validMonths.length;
      predictions[category] = Math.round(average);
    }
  });

  return predictions;
};

/**
 * Predict when budget will be exceeded
 */
export const predictBudgetExceedDate = (budget, currentSpent, transactions) => {
  if (currentSpent >= budget.amount) {
    return { exceeded: true, daysAgo: 0 };
  }

  // Calculate daily average spending for this category
  const categoryTransactions = transactions
    .filter(t => t.category === budget.category && t.type === 'pengeluaran');

  if (categoryTransactions.length === 0) {
    return null;
  }

  const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
  const daysActive = Math.max(
    ...categoryTransactions.map(t => new Date().getDate() - new Date(t.date).getDate())
  );

  const dailyAverage = totalSpent / Math.max(daysActive, 1);
  const remaining = budget.amount - currentSpent;
  const daysUntilExceed = Math.ceil(remaining / dailyAverage);

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  return {
    exceeded: false,
    daysUntilExceed: Math.max(daysUntilExceed, 0),
    willExceedThisMonth: daysUntilExceed < (daysInMonth - new Date().getDate()),
    projectedTotal: Math.round(currentSpent + (dailyAverage * (daysInMonth - new Date().getDate())))
  };
};