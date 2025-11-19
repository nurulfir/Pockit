import { createContext, useContext, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { useSavings } from '../hooks/useSavings';
import { useBills } from '../hooks/useBills';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openModal, setOpenModal] = useState(false);

  const transactions = useTransactions();
  const budget = useBudget();
  const savings = useSavings();
  const bills = useBills();

  const value = {
    selectedMonth,
    setSelectedMonth,
    activeTab,
    setActiveTab,
    openModal,
    setOpenModal,
    transactions,
    budget,
    savings,
    bills
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};