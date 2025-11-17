import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

// Custom hook untuk manage transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await storageService.getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const addTransaction = async (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString(),
      month: new Date().getMonth()
    };

    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    await storageService.saveTransactions(updated);
  };

  const deleteTransaction = async (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await storageService.saveTransactions(updated);
  };

  const getFilteredTransactions = (month) => {
    return transactions.filter(t => t.month === month);
  };

  const calculateTotals = (month) => {
    const filtered = getFilteredTransactions(month);
    
    const totalIncome = filtered
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filtered
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getFilteredTransactions,
    calculateTotals
  };
};