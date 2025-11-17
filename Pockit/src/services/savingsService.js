const SAVINGS_KEY = 'finance-savings-goals';

export const savingsService = {
  async getGoals() {
    try {
      const result = await window.storage.get(SAVINGS_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async saveGoals(goals) {
    try {
      await window.storage.set(SAVINGS_KEY, JSON.stringify(goals));
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
  }
};