import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { MonthSelector } from './components/Dashboard/MonthSelector';
import { SummaryCards } from './components/Dashboard/SummaryCards';
import { FinancialHealthScore } from './components/Dashboard/FinancialHealthScore';
import { TransactionForm } from './components/Transaction/TransactionForm';
import { TransactionList } from './components/Transaction/TransactionList';
import { BudgetPlanner } from './components/Budget/BudgetPlanner';
import { SavingsGoals } from './components/Savings/SavingsGoals';
import { BillReminders } from './components/Bills/BillReminders';
import { ExpenseByCategory } from './components/Charts/ExpenseByCategory';
import { MonthlyTrend } from './components/Charts/MonthlyTrend';
import { SpendingTrendLine } from './components/Charts/SpendingTrendLine';
import { BudgetVsActual } from './components/Charts/BudgetVsActual';
import { LoadingSkeleton } from './components/Shared/LoadingSkeleton';
import { useTransactions } from './hooks/useTransactions';
import { useBudget } from './hooks/useBudget';
import { useSavings } from './hooks/useSavings';
import { useBills } from './hooks/useBills';
import { calculateFinancialHealthScore, calculateSavingsRate, calculateBudgetAdherence } from './utils/calculations';
import { fadeIn } from './utils/animations';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    deleteTransaction,
    getFilteredTransactions,
    calculateTotals
  } = useTransactions();

  const {
    budgets,
    loading: budgetsLoading,
    addBudget,
    deleteBudget
  } = useBudget();

  const {
    goals,
    loading: goalsLoading,
    addGoal,
    addToGoal,
    deleteGoal
  } = useSavings();

  const {
    bills,
    loading: billsLoading,
    addBill,
    markPaid,
    deleteBill,
    getUpcomingBills
  } = useBills();

  const loading = transactionsLoading || budgetsLoading || goalsLoading || billsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <LoadingSkeleton type="card" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
          </div>
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions(selectedMonth);
  const { totalIncome, totalExpense, balance } = calculateTotals(selectedMonth);

  const expenseByCategory = filteredTransactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
  const budgetAdherence = calculateBudgetAdherence(budgets, expenseByCategory);
  const hasEmergencyFund = balance >= totalExpense * 3;

  const healthScore = calculateFinancialHealthScore({
    totalIncome,
    totalExpense,
    budgetAdherence,
    savingsRate,
    hasEmergencyFund
  });

  const insights = [];
  if (savingsRate >= 20) insights.push({ type: 'success', message: 'Great savings rate! You\'re saving 20%+ of your income.' });
  else if (savingsRate < 5) insights.push({ type: 'warning', message: 'Try to save at least 10% of your income.' });
  
  if (budgetAdherence >= 90) insights.push({ type: 'success', message: 'Excellent budget discipline!' });
  else if (budgetAdherence < 50) insights.push({ type: 'warning', message: 'You\'re exceeding many budgets. Review your spending.' });
  
  if (hasEmergencyFund) insights.push({ type: 'success', message: 'You have a solid emergency fund!' });
  else insights.push({ type: 'warning', message: 'Build an emergency fund (3 months of expenses).' });

  const upcomingBills = getUpcomingBills(7);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'savings', label: 'Savings', icon: '🎯' },
    { id: 'bills', label: 'Bills', icon: '🔔' }
  ];

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <Header />
            <MonthSelector 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 font-semibold capitalize transition relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <SummaryCards 
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  balance={balance}
                />
              </div>
              <FinancialHealthScore score={healthScore} insights={insights} />
            </div>

            <div className="mb-6">
              <TransactionForm onAddTransaction={addTransaction} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ExpenseByCategory transactions={filteredTransactions} />
              <SpendingTrendLine transactions={transactions} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MonthlyTrend transactions={transactions} />
              {budgets.length > 0 && (
                <BudgetVsActual budgets={budgets} expenses={expenseByCategory} />
              )}
            </div>

            <TransactionList 
              transactions={filteredTransactions}
              selectedMonth={selectedMonth}
              onDelete={deleteTransaction}
            />
          </motion.div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <motion.div
            key="budget"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BudgetPlanner
              budgets={budgets}
              expenses={expenseByCategory}
              onAdd={addBudget}
              onDelete={deleteBudget}
            />
          </motion.div>
        )}

        {/* Savings Tab */}
        {activeTab === 'savings' && (
          <motion.div
            key="savings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SavingsGoals
              goals={goals}
              onAdd={addGoal}
              onAddToGoal={addToGoal}
              onDelete={deleteGoal}
            />
          </motion.div>
        )}

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <motion.div
            key="bills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BillReminders
              bills={bills}
              upcomingBills={upcomingBills}
              onAdd={addBill}
              onMarkPaid={markPaid}
              onDelete={deleteBill}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default App;