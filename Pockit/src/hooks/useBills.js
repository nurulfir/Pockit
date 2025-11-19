import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    const data = await storageService.getBills();
    setBills(data);
    setLoading(false);
  };

  const addBill = async (bill) => {
    const newBill = await storageService.addBill(bill);
    setBills([...bills, newBill]);
    return newBill;
  };

  const markPaid = async (id) => {
    const updated = await storageService.markBillPaid(id);
    if (updated) {
      setBills(bills.map(b => b.id === id ? updated : b));
    }
    return updated;
  };

  const deleteBill = async (id) => {
    await storageService.deleteBill(id);
    setBills(bills.filter(b => b.id !== id));
  };

  const getUpcomingBills = (daysAhead = 7) => {
    return storageService.getUpcomingBills(bills, daysAhead);
  };

  const getPendingBills = () => {
    return bills.filter(b => b.status === 'pending');
  };

  return {
    bills,
    loading,
    addBill,
    markPaid,
    deleteBill,
    getUpcomingBills,
    getPendingBills
  };
};