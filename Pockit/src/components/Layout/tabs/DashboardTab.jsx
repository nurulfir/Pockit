import { useAppContext } from '../../../contexts/AppContext';
import { SummaryCards } from '../../Dashboard/SummaryCards';
import { FinancialHealthDetailed } from '../../Dashboard/FinancialHealthDetailed';
import { ExpenseByCategory } from '../../Charts/ExpenseByCategory';
import { SpendingTrendLine } from '../../Charts/SpendingTrendLine';
import { MonthlyTrend } from '../../Charts/MonthlyTrend';
import { BudgetVsActual } from '../../Charts/BudgetVsActual';
import { TransactionList } from '../../Transaction/TransactionList';
import { useDashboardData } from '../../../hooks/useDashboardData';

export const DashboardTab = () => {
  const { selectedMonth, transactions, budget } = useAppContext();
  const { 
    filteredTransactions, 
    totalIncome, 
    totalExpense, 
    balance,
    expenseByCategory,
    healthData,
    insights 
  } = useDashboardData(selectedMonth);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SummaryCards 
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        </div>
        <FinancialHealthDetailed healthData={healthData} insights={insights} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpenseByCategory transactions={filteredTransactions} />
        <SpendingTrendLine transactions={transactions.transactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyTrend transactions={transactions.transactions} />
        {budget.budgets.length > 0 && (
          <BudgetVsActual budgets={budget.budgets} expenses={expenseByCategory} />
        )}
      </div>

      <TransactionList 
        transactions={filteredTransactions}
        selectedMonth={selectedMonth}
        onDelete={transactions.deleteTransaction}
      />
    </>
  );
};