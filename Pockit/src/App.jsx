import { useState } from 'react';
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
import { useTransactions } from './hooks/useTransactions';
import { useBudget } from './hooks/useBudget';
import { useSavings } from './hooks/useSavings';
import { useBills } from './hooks/useBills';
import { calculateFinancialHealthScore, calculateSavingsRate, calculateBudgetAdherence } from './utils/calculations';

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

  if (transactionsLoading || budgetsLoading || goalsLoading || billsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
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

  // Calculate Financial Health Score
  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
  const budgetAdherence = calculateBudgetAdherence(budgets, expenseByCategory);
  const hasEmergencyFund = balance >= totalExpense * 3; // 3 months of expenses

  const healthScore = calculateFinancialHealthScore({
    totalIncome,
    totalExpense,
    budgetAdherence,
    savingsRate,
    hasEmergencyFund
  });

  const insights = [];
  if (savingsRate >= 20) {
    insights.push({ type: 'success', message: 'Great savings rate! You\'re saving 20%+ of your income.' });
  } else if (savingsRate < 5) {
    insights.push({ type: 'warning', message: 'Try to save at least 10% of your income.' });
  }

  if (budgetAdherence >= 90) {
    insights.push({ type: 'success', message: 'Excellent budget discipline!' });
  } else if (budgetAdherence < 50) {
    insights.push({ type: 'warning', message: 'You\'re exceeding many budgets. Review your spending.' });
  }

  if (hasEmergencyFund) {
    insights.push({ type: 'success', message: 'You have a solid emergency fund!' });
  } else {
    insights.push({ type: 'warning', message: 'Build an emergency fund (3 months of expenses).' });
  }

  const upcomingBills = getUpcomingBills(7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Header />
            <MonthSelector 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b-2 border-gray-200">
            {['dashboard', 'budget', 'savings', 'bills'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'border-b-4 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
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

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
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
          </>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <BudgetPlanner
            budgets={budgets}
            expenses={expenseByCategory}
            onAdd={addBudget}
            onDelete={deleteBudget}
          />
        )}

        {/* Savings Tab */}
        {activeTab === 'savings' && (
          <SavingsGoals
            goals={goals}
            onAdd={addGoal}
            onAddToGoal={addToGoal}
            onDelete={deleteGoal}
          />
        )}

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <BillReminders
            bills={bills}
            upcomingBills={upcomingBills}
            onAdd={addBill}
            onMarkPaid={markPaid}
            onDelete={deleteBill}
          />
        )}
      </div>
    </div>
  );
}

export default App;