// Service untuk handle storage operations
const STORAGE_KEY = 'finance-transactions';

export const storageService = {
  async getTransactions() {
    try {
      const result = await window.storage.get(STORAGE_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      console.log('Belum ada data tersimpan');
      return [];
    }
  },

  async saveTransactions(transactions) {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(transactions));
      return true;
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      return false;
    }
  }
};