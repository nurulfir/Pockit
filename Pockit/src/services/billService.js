const BILLS_KEY = 'finance-bill-reminders';

export const billService = {
  async getBills() {
    try {
      const result = await window.storage.get(BILLS_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async saveBills(bills) {
    try {
      await window.storage.set(BILLS_KEY, JSON.stringify(bills));
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
  }
};