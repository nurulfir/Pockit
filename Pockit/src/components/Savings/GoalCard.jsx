import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const GoalCard = ({ goal, onAddToGoal, onDelete }) => {
	const [amount, setAmount] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);

	const percentage = (goal.currentAmount / goal.targetAmount) * 100;
	const remaining = goal.targetAmount - goal.currentAmount;
	const isCompleted = goal.status === "completed";

	const handleAdd = () => {
		if (!amount || parseFloat(amount) <= 0) return;
		onAddToGoal(goal.id, parseFloat(amount));
		setAmount("");
		setShowAddForm(false);
	};

	const getDaysRemaining = () => {
		if (!goal.deadline) return null;
		const today = new Date();
		const deadline = new Date(goal.deadline);
		const diffTime = deadline - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysRemaining = getDaysRemaining();

	return (
		<div
			className={`border-2 rounded-lg p-4 transition-colors ${
				isCompleted
					? "border-gray-300 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700"
					: "border-gray-300 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700"
			}`}
		>
			<div className="flex justify-between items-start mb-3">
				<div className="flex items-center gap-2">
					<span className="text-2xl">{goal.icon}</span>
					<div>
						<h3 className="font-bold text-gray-800 dark:text-gray-100">
							{goal.name}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{formatCurrency(goal.currentAmount)} /{" "}
							{formatCurrency(goal.targetAmount)}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{!isCompleted && (
						<button
							onClick={() => setShowAddForm(!showAddForm)}
							className="text-purple-600 dark:text-purple-300 
                         hover:text-purple-800 dark:hover:text-purple-200
                         bg-white dark:bg-gray-800 
                         border-2 border-purple-300 dark:border-purple-600 
                         p-2 rounded-lg transition"
						>
							<Plus className="w-4 h-4" />
						</button>
					)}

					<button
						onClick={() => onDelete(goal.id)}
						className="text-red-500 dark:text-red-400 
                       hover:text-red-700 dark:hover:text-red-300
                       bg-white dark:bg-gray-800 
                       border-2 border-red-300 dark:border-red-600 
                       p-2 rounded-lg transition"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>

			{showAddForm && !isCompleted && (
				<div className="flex gap-2 mb-3">
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="Add amount"
						className="flex-1 border-2 border-purple-300 dark:border-purple-600 
                       rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-200
                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
					/>
					<button
						onClick={handleAdd}
						className="bg-purple-600 dark:bg-purple-700 
                       text-white px-4 py-2 rounded-lg 
                       hover:bg-purple-700 dark:hover:bg-purple-800 
                       transition"
					>
						Add
					</button>
				</div>
			)}

			{/* Progress Bar */}
			<div className="bg-white dark:bg-gray-800 rounded-full h-4 overflow-hidden mb-2">
				<div
					className={`h-full transition-all duration-500 ${
						isCompleted ? "bg-green-500" : "bg-purple-500"
					}`}
					style={{ width: `${Math.min(percentage, 100)}%` }}
				/>
			</div>

			<div className="flex justify-between items-center text-sm">
				<span
					className={`font-semibold ${
						isCompleted
							? "text-green-600 dark:text-green-400"
							: "text-purple-600 dark:text-purple-300"
					}`}
				>
					{percentage.toFixed(0)}% achieved
				</span>

				{isCompleted ? (
					<span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
						<Check className="w-4 h-4" /> Completed!
					</span>
				) : (
					<>
						{daysRemaining !== null && (
							<span
								className={`${
									daysRemaining < 30
										? "text-orange-600 dark:text-orange-400"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								{daysRemaining > 0
									? `${daysRemaining} days left`
									: "Deadline passed"}
							</span>
						)}

						{!goal.deadline && (
							<span className="text-gray-600 dark:text-gray-400">
								{formatCurrency(remaining)} to go
							</span>
						)}
					</>
				)}
			</div>
		</div>
	);
};
