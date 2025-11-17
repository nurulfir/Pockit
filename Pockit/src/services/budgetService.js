const BUDGET_KEY = 'finance-budgets';

export const budgetService = {
  async getBudgets() {
    try {
      const result = await window.storage.get(BUDGET_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      console.log('No budgets found');
      return [];
    }
  },

  async saveBudgets(budgets) {
    try {
      await window.storage.set(BUDGET_KEY, JSON.stringify(budgets));
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
  }
};