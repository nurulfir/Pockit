// Unified Storage Service menggunakan localStorage browser
const STORAGE_KEYS = {
  TRANSACTIONS: 'finance-transactions',
  BUDGETS: 'finance-budgets',
  SAVINGS: 'finance-savings-goals',
  BILLS: 'finance-bill-reminders',
};

export const storageService = {
  // ==================== TRANSACTIONS ====================
  async getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.log('Belum ada transaksi tersimpan');
      return [];
    }
  },

  async saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      return true;
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
      return false;
    }
  },

  // ==================== BUDGETS ====================
  async getBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.log('No budgets found');
      return [];
    }
  },

  async saveBudgets(budgets) {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      return true;
    } catch (error) {
      console.error('Failed to save budgets:', error);
      return false;
    }
  },

  async addBudget(budget) {
    const budgets = await this.getBudgets();
    const newBudget = {
      id: Date.now(),
      ...budget,
      createdAt: new Date().toISOString()
    };
    budgets.push(newBudget);
    await this.saveBudgets(budgets);
    return newBudget;
  },

  async updateBudget(id, updates) {
    const budgets = await this.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updates };
      await this.saveBudgets(budgets);
      return budgets[index];
    }
    return null;
  },

  async deleteBudget(id) {
    const budgets = await this.getBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    await this.saveBudgets(filtered);
    return true;
  },

  // ==================== SAVINGS GOALS ====================
  async getGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async saveGoals(goals) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(goals));
      return true;
    } catch (error) {
      console.error('Failed to save goals:', error);
      return false;
    }
  },

  async addGoal(goal) {
    const goals = await this.getGoals();
    const newGoal = {
      id: Date.now(),
      ...goal,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    goals.push(newGoal);
    await this.saveGoals(goals);
    return newGoal;
  },

  async updateGoalProgress(id, amount) {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index].currentAmount += amount;
      if (goals[index].currentAmount >= goals[index].targetAmount) {
        goals[index].status = 'completed';
        goals[index].completedAt = new Date().toISOString();
      }
      await this.saveGoals(goals);
      return goals[index];
    }
    return null;
  },

  async deleteGoal(id) {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    await this.saveGoals(filtered);
    return true;
  },

  // ==================== BILLS ====================
  async getBills() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async saveBills(bills) {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
      return true;
    } catch (error) {
      console.error('Failed to save bills:', error);
      return false;
    }
  },

  async addBill(bill) {
    const bills = await this.getBills();
    const newBill = {
      id: Date.now(),
      ...bill,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    bills.push(newBill);
    await this.saveBills(bills);
    return newBill;
  },

  async markBillPaid(id) {
    const bills = await this.getBills();
    const index = bills.findIndex(b => b.id === id);
    if (index !== -1) {
      bills[index].status = 'paid';
      bills[index].paidAt = new Date().toISOString();
      await this.saveBills(bills);
      return bills[index];
    }
    return null;
  },

  async deleteBill(id) {
    const bills = await this.getBills();
    const filtered = bills.filter(b => b.id !== id);
    await this.saveBills(filtered);
    return true;
  },

  getUpcomingBills(bills, daysAhead = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= futureDate && bill.status === 'pending';
    });
  },

  // ==================== UTILITY ====================
  async clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      localStorage.removeItem(STORAGE_KEYS.SAVINGS);
      localStorage.removeItem(STORAGE_KEYS.BILLS);
      return true;
    } catch (error) {
      console.error('Gagal menghapus data:', error);
      return false;
    }
  },

  async exportAllData() {
    try {
      const transactions = await this.getTransactions();
      const budgets = await this.getBudgets();
      const goals = await this.getGoals();
      const bills = await this.getBills();

      const data = {
        transactions,
        budgets,
        goals,
        bills,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pocket-it-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Gagal export data:', error);
      return false;
    }
  },

  async importAllData(data) {
    try {
      if (data.transactions) await this.saveTransactions(data.transactions);
      if (data.budgets) await this.saveBudgets(data.budgets);
      if (data.goals) await this.saveGoals(data.goals);
      if (data.bills) await this.saveBills(data.bills);
      return true;
    } catch (error) {
      console.error('Gagal import data:', error);
      return false;
    }
  },
};