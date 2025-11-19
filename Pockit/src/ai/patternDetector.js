import { differenceInDays, format, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Detect spending patterns from transaction history
 */
export const detectSpendingPatterns = (transactions) => {
  const patterns = [];

  // 1. High spending days detection
  const dailySpending = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => {
      const date = format(new Date(t.date), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});

  const avgDailySpend = Object.values(dailySpending).reduce((a, b) => a + b, 0) / Object.keys(dailySpending).length;
  const highSpendDays = Object.entries(dailySpending)
    .filter(([_, amount]) => amount > avgDailySpend * 2)
    .length;

  if (highSpendDays > 0) {
    patterns.push({
      type: 'high_spending_days',
      severity: highSpendDays > 5 ? 'warning' : 'info',
      title: 'High Spending Days Detected',
      description: `You had ${highSpendDays} days with unusually high spending (2x your daily average).`,
      recommendation: 'Try to spread out large purchases to better manage your budget.'
    });
  }

  // 2. Weekend vs Weekday spending
  const weekendSpending = transactions
    .filter(t => {
      const day = new Date(t.date).getDay();
      return t.type === 'pengeluaran' && (day === 0 || day === 6);
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const weekdaySpending = transactions
    .filter(t => {
      const day = new Date(t.date).getDay();
      return t.type === 'pengeluaran' && day > 0 && day < 6;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (weekendSpending > weekdaySpending * 0.4) {
    patterns.push({
      type: 'weekend_spending',
      severity: 'info',
      title: 'High Weekend Spending',
      description: `Your weekend spending is ${Math.round((weekendSpending / (weekendSpending + weekdaySpending)) * 100)}% of your total expenses.`,
      recommendation: 'Consider free weekend activities to reduce costs.'
    });
  }

  // 3. Category concentration
  const categorySpending = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const dominantCategory = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])[0];

  if (dominantCategory && (dominantCategory[1] / totalSpending) > 0.5) {
    patterns.push({
      type: 'category_concentration',
      severity: 'warning',
      title: `Heavy Focus on ${dominantCategory[0]}`,
      description: `${Math.round((dominantCategory[1] / totalSpending) * 100)}% of your spending goes to ${dominantCategory[0]}.`,
      recommendation: `Consider diversifying your spending or finding cheaper alternatives for ${dominantCategory[0]}.`
    });
  }

  // 4. Impulse spending detection (multiple small transactions in short time)
  const sortedTransactions = [...transactions]
    .filter(t => t.type === 'pengeluaran')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let impulseCount = 0;
  for (let i = 0; i < sortedTransactions.length - 1; i++) {
    const timeDiff = differenceInDays(
      new Date(sortedTransactions[i + 1].date),
      new Date(sortedTransactions[i].date)
    );
    if (timeDiff === 0 && sortedTransactions[i].amount < avgDailySpend * 0.3) {
      impulseCount++;
    }
  }

  if (impulseCount > 10) {
    patterns.push({
      type: 'impulse_spending',
      severity: 'warning',
      title: 'Frequent Small Purchases Detected',
      description: `You made ${impulseCount} small purchases. These add up quickly!`,
      recommendation: 'Try the 24-hour rule: wait a day before making non-essential purchases.'
    });
  }

  // 5. Consistent overspending detection
  const monthlyOverspend = transactions
    .filter(t => {
      const income = transactions
        .filter(tx => tx.type === 'pemasukan' && tx.month === t.month)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = transactions
        .filter(tx => tx.type === 'pengeluaran' && tx.month === t.month)
        .reduce((sum, tx) => sum + tx.amount, 0);
      return expense > income;
    });

  if (monthlyOverspend.length > 0) {
    patterns.push({
      type: 'overspending',
      severity: 'error',
      title: 'Spending Exceeds Income',
      description: 'You\'re spending more than you earn. This is unsustainable.',
      recommendation: 'Review your expenses and cut non-essential spending immediately.'
    });
  }

  return patterns;
};

/**
 * Detect positive habits
 */
export const detectPositiveHabits = (transactions, budgets, goals) => {
  const habits = [];

  // 1. Consistent saving
  const monthlySavings = [];
  for (let i = 0; i < 3; i++) {
    const month = (new Date().getMonth() - i + 12) % 12;
    const income = transactions
      .filter(t => t.month === month && t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.month === month && t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
    monthlySavings.push(income - expense);
  }

  if (monthlySavings.every(s => s > 0)) {
    habits.push({
      type: 'consistent_saving',
      title: '🎉 Great Saving Habit!',
      description: 'You\'ve been saving money consistently for 3 months.',
      emoji: '💰'
    });
  }

  // 2. Budget adherence
  if (budgets.length > 0) {
    const adherenceRate = budgets.filter(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.type === 'pengeluaran')
        .reduce((sum, t) => sum + t.amount, 0);
      return spent <= b.amount;
    }).length / budgets.length;

    if (adherenceRate > 0.8) {
      habits.push({
        type: 'budget_discipline',
        title: '🎯 Budget Master!',
        description: `You're staying within budget ${Math.round(adherenceRate * 100)}% of the time.`,
        emoji: '🏆'
      });
    }
  }

  // 3. Goal progress
  const activeGoals = goals.filter(g => g.status === 'active');
  if (activeGoals.length > 0) {
    habits.push({
      type: 'goal_oriented',
      title: '🚀 Goal-Oriented',
      description: `You have ${activeGoals.length} active savings goal${activeGoals.length > 1 ? 's' : ''}. Keep pushing!`,
      emoji: '⭐'
    });
  }

  return habits;
};