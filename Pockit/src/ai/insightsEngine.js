import { detectSpendingPatterns, detectPositiveHabits } from './patternDetector';
import { predictNextMonthSpending, predictCategorySpending } from './predictor';

/**
 * Generate comprehensive financial insights
 */
export const generateInsights = (transactions, budgets, goals, bills) => {
  const insights = {
    patterns: detectSpendingPatterns(transactions),
    positiveHabits: detectPositiveHabits(transactions, budgets, goals),
    predictions: {
      nextMonth: predictNextMonthSpending(transactions),
      byCategory: predictCategorySpending(transactions)
    },
    recommendations: generateRecommendations(transactions, budgets, goals),
    alerts: generateAlerts(transactions, budgets, bills)
  };

  return insights;
};

/**
 * Generate personalized recommendations
 */
const generateRecommendations = (transactions, budgets, goals) => {
  const recommendations = [];

  // 1. Savings recommendation
  const currentMonth = new Date().getMonth();
  const income = transactions
    .filter(t => t.month === currentMonth && t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.month === currentMonth && t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  if (savingsRate < 10) {
    recommendations.push({
      type: 'savings',
      priority: 'high',
      title: 'Increase Your Savings Rate',
      description: `You're currently saving ${Math.round(savingsRate)}% of your income. Aim for at least 20%.`,
      action: 'Set up automatic savings transfer right after receiving income.',
      potentialSaving: Math.round(income * 0.1)
    });
  }

  // 2. Budget recommendations
  if (budgets.length === 0) {
    recommendations.push({
      type: 'budget',
      priority: 'high',
      title: 'Create a Budget Plan',
      description: 'You don\'t have any budgets set. Budgeting helps control spending.',
      action: 'Start by setting budgets for your top 3 spending categories.'
    });
  }

  // 3. Category optimization
  const categorySpending = transactions
    .filter(t => t.type === 'pengeluaran' && t.month === currentMonth)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])[0];

  if (topCategory && topCategory[1] > expense * 0.4) {
    const suggestions = {
      'Makanan': 'Try meal prepping and cooking at home more often.',
      'Transport': 'Consider carpooling or using public transportation.',
      'Hiburan': 'Look for free entertainment options or limit streaming subscriptions.',
      'Kebutuhan': 'Buy in bulk and wait for sales before shopping.'
    };

    recommendations.push({
      type: 'optimization',
      priority: 'medium',
      title: `Optimize ${topCategory[0]} Spending`,
      description: `${topCategory[0]} is your biggest expense at Rp ${topCategory[1].toLocaleString('id-ID')}.`,
      action: suggestions[topCategory[0]] || 'Review this category for cost-cutting opportunities.',
      potentialSaving: Math.round(topCategory[1] * 0.2)
    });
  }

  // 4. Goal recommendations
  if (goals.filter(g => g.status === 'active').length === 0 && savingsRate > 10) {
    recommendations.push({
      type: 'goals',
      priority: 'low',
      title: 'Set Savings Goals',
      description: 'You\'re saving money! Give it a purpose by setting specific goals.',
      action: 'Create a goal for something you want to save for (laptop, vacation, etc.).'
    });
  }

  return recommendations.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });
};

/**
 * Generate alerts for urgent issues
 */
const generateAlerts = (transactions, budgets, bills) => {
  const alerts = [];
  const currentMonth = new Date().getMonth();

  // 1. Budget exceeded alerts
  budgets.forEach(budget => {
    const spent = transactions
      .filter(t => t.category === budget.category && t.month === currentMonth && t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    if (spent > budget.amount) {
      alerts.push({
        type: 'budget_exceeded',
        severity: 'error',
        title: `${budget.category} Budget Exceeded`,
        message: `You've spent Rp ${spent.toLocaleString('id-ID')} out of Rp ${budget.amount.toLocaleString('id-ID')}`
      });
    } else if (spent > budget.amount * 0.9) {
      alerts.push({
        type: 'budget_warning',
        severity: 'warning',
        title: `${budget.category} Budget Almost Reached`,
        message: `You've used ${Math.round((spent / budget.amount) * 100)}% of your budget`
      });
    }
  });

  // 2. Overdue bills
  const overdueBills = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    return dueDate < new Date() && bill.status === 'pending';
  });

  if (overdueBills.length > 0) {
    alerts.push({
      type: 'overdue_bills',
      severity: 'error',
      title: 'Overdue Bills',
      message: `You have ${overdueBills.length} overdue bill${overdueBills.length > 1 ? 's' : ''}`
    });
  }

  // 3. Negative balance
  const income = transactions
    .filter(t => t.month === currentMonth && t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.month === currentMonth && t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  if (expense > income) {
    alerts.push({
      type: 'negative_balance',
      severity: 'error',
      title: 'Spending Exceeds Income',
      message: `You're spending Rp ${(expense - income).toLocaleString('id-ID')} more than you earn this month`
    });
  }

  return alerts;
};