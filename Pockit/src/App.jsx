import { useState } from "react";
import { motion } from "framer-motion";

import { Header } from "./components/Layout/Header";
import { SummaryCards } from "./components/Dashboard/SummaryCards";
import { FinancialHealthDetailed } from "./components/Dashboard/FinancialHealthDetailed";
import { InsightsDashboard } from "./components/Insights/InsightsDashboard";
import { TransactionForm } from "./components/Transaction/TransactionForm";
import { TransactionList } from "./components/Transaction/TransactionList";
import { BudgetPlanner } from "./components/Budget/BudgetPlanner";
import { SavingsGoals } from "./components/Savings/SavingsGoals";
import { BillReminders } from "./components/Bills/BillReminders";

import { ExpenseByCategory } from "./components/Charts/ExpenseByCategory";
import { MonthlyTrend } from "./components/Charts/MonthlyTrend";
import { SpendingTrendLine } from "./components/Charts/SpendingTrendLine";
import { BudgetVsActual } from "./components/Charts/BudgetVsActual";

import { LoadingSkeleton } from "./components/Shared/LoadingSkeleton";
import { Modal } from "./components/Shared/Modal";

import { useTransactions } from "./hooks/useTransactions";
import { useBudget } from "./hooks/useBudget";
import { useSavings } from "./hooks/useSavings";
import { useBills } from "./hooks/useBills";

import {
	calculateFinancialHealthScore,
	calculateSavingsRate,
	calculateBudgetAdherence,
} from "./utils/calculations";
import { fadeIn } from "./utils/animations";

function App() {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [activeTab, setActiveTab] = useState("dashboard");
	const [openModal, setOpenModal] = useState(false);

	const {
		transactions,
		loading: transactionsLoading,
		addTransaction,
		deleteTransaction,
		getFilteredTransactions,
		calculateTotals,
	} = useTransactions();

	const {
		budgets,
		loading: budgetsLoading,
		addBudget,
		deleteBudget,
	} = useBudget();

	const {
		goals,
		loading: goalsLoading,
		addGoal,
		addToGoal,
		deleteGoal,
	} = useSavings();

	const {
		bills,
		loading: billsLoading,
		addBill,
		markPaid,
		deleteBill,
		getUpcomingBills,
	} = useBills();

	const loading =
		transactionsLoading || budgetsLoading || goalsLoading || billsLoading;

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
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
		.filter((t) => t.type === "pengeluaran")
		.reduce((acc, t) => {
			acc[t.category] = (acc[t.category] || 0) + t.amount;
			return acc;
		}, {});

	const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
	const budgetAdherence = calculateBudgetAdherence(budgets, expenseByCategory);
	const hasEmergencyFund = balance >= totalExpense * 3;

	const healthData = calculateFinancialHealthScore({
		totalIncome,
		totalExpense,
		budgetAdherence,
		savingsRate,
		hasEmergencyFund,
	});

	const insights = [];
	if (savingsRate >= 20)
		insights.push({
			type: "success",
			message: "Great savings rate! You're saving 20%+ of your income.",
		});
	else if (savingsRate < 5)
		insights.push({
			type: "warning",
			message: "Try to save at least 10% of your income.",
		});

	if (budgetAdherence >= 90)
		insights.push({ type: "success", message: "Excellent budget discipline!" });
	else if (budgetAdherence < 50)
		insights.push({
			type: "warning",
			message: "You’re exceeding many budgets.",
		});

	if (hasEmergencyFund)
		insights.push({
			type: "success",
			message: "You have a solid emergency fund!",
		});
	else
		insights.push({
			type: "warning",
			message: "Build an emergency fund (3 months of expenses).",
		});

	const upcomingBills = getUpcomingBills(7);

	const tabs = [
		{ id: "dashboard", label: "Dashboard", icon: "📊" },
		{ id: "insights", label: "AI Insights", icon: "🤖" },
		{ id: "budget", label: "Budget", icon: "💰" },
		{ id: "savings", label: "Savings", icon: "🎯" },
		{ id: "bills", label: "Bills", icon: "🔔" },
	];

	return (
		<motion.div
			variants={fadeIn}
			initial="hidden"
			animate="visible"
			className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4"
		>
			<div className="max-w-7xl mx-auto">
				<Header
					tabs={tabs}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					selectedMonth={selectedMonth}
					setSelectedMonth={setSelectedMonth}
					onAddTransaction={() => setOpenModal(true)}
				/>

				{/* ========================= DASHBOARD ========================= */}
				{activeTab === "dashboard" && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						{/* ======= SUMMARY CARDS ======= */}
						<div className="mb-8">
							<SummaryCards
								totalIncome={totalIncome}
								totalExpense={totalExpense}
								balance={balance}
							/>
						</div>

						{/* ======= TRANSACTIONS + FINANCIAL HEALTH ======= */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
							<div className="lg:col-span-2 h-full">
								<TransactionList
									transactions={filteredTransactions}
									selectedMonth={selectedMonth}
									onDelete={deleteTransaction}
								/>
							</div>

							<div className="lg:col-span-1 h-full">
								<FinancialHealthDetailed
									healthData={healthData}
									insights={insights}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
							<SpendingTrendLine transactions={transactions} />
							<MonthlyTrend transactions={transactions} />
						</div>
					</motion.div>
				)}

				{/* ========================= OTHER TABS ========================= */}

				{activeTab === "insights" && (
					<InsightsDashboard
						transactions={transactions}
						budgets={budgets}
						goals={goals}
						bills={bills}
					/>
				)}

				{activeTab === "budget" && (
					<BudgetPlanner
						budgets={budgets}
						expenses={expenseByCategory}
						onAdd={addBudget}
						onDelete={deleteBudget}
					/>
				)}

				{activeTab === "savings" && (
					<SavingsGoals
						goals={goals}
						onAdd={addGoal}
						onAddToGoal={addToGoal}
						onDelete={deleteGoal}
					/>
				)}

				{activeTab === "bills" && (
					<BillReminders
						bills={bills}
						upcomingBills={upcomingBills}
						onAdd={addBill}
						onMarkPaid={markPaid}
						onDelete={deleteBill}
					/>
				)}
			</div>

			<Modal
				isOpen={openModal}
				onClose={() => setOpenModal(false)}
				title="Tambah Transaksi"
			>
				<TransactionForm
					onAddTransaction={(data) => {
						addTransaction(data);
						setOpenModal(false);
					}}
					hideHeader
				/>
			</Modal>
		</motion.div>
	);
}

export default App;
