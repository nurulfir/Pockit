import { useAppContext } from '../../contexts/AppContext';
import { LoadingSkeleton } from './LoadingSkeleton';

export const LoadingScreen = ({ children }) => {
  const { transactions, budget, savings, bills } = useAppContext();
  
  const loading = 
    transactions.loading || 
    budget.loading || 
    savings.loading || 
    bills.loading;

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

  return children;
};
