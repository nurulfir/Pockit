import { motion } from 'framer-motion';
import { DashboardTab } from './tabs/DashboardTab';
import { InsightsTab } from './tabs/InsightsTab';
import { BudgetTab } from './tabs/BudgetTab';
import { SavingsTab } from './tabs/SavingsTab';
import { BillsTab } from './tabs/BillsTab';

export const TabContent = ({ activeTab }) => {
  const tabs = {
    dashboard: DashboardTab,
    insights: InsightsTab,
    budget: BudgetTab,
    savings: SavingsTab,
    bills: BillsTab
  };

  const ActiveComponent = tabs[activeTab];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ActiveComponent />
    </motion.div>
  );
};