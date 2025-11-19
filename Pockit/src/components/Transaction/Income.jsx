import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, FileText } from 'lucide-react';

export const Income = ({ onAddIncome, hideHeader = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'gaji',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const incomeCategories = [
    { value: 'gaji', label: 'Gaji', icon: '💼' },
    { value: 'bonus', label: 'Bonus', icon: '🎁' },
    { value: 'investasi', label: 'Investasi', icon: '📈' },
    { value: 'freelance', label: 'Freelance', icon: '💻' },
    { value: 'bisnis', label: 'Bisnis', icon: '🏢' },
    { value: 'lainnya', label: 'Lainnya', icon: '💰' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Masukkan jumlah pemasukan yang valid');
      return;
    }

    const incomeData = {
      ...formData,
      amount: parseFloat(formData.amount),
      type: 'pemasukan',
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    onAddIncome(incomeData);

    // Reset form
    setFormData({
      amount: '',
      category: 'gaji',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {!hideHeader && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tambah Pemasukan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Catat sumber pemasukan Anda
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Jumlah Pemasukan
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Contoh: 5000000"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-all
            "
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {incomeCategories.map((cat) => (
              <motion.button
                key={cat.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: cat.value }))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-3 rounded-xl border-2 transition-all
                  ${
                    formData.category === cat.value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }
                `}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cat.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Tanggal
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-all
            "
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Deskripsi (Opsional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Contoh: Gaji bulan Januari"
            rows={3}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-all
              resize-none
            "
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full py-3 rounded-xl
            bg-green-600 hover:bg-green-700
            text-white font-semibold
            shadow-lg hover:shadow-green-500/50
            transition-all
          "
        >
          💰 Tambah Pemasukan
        </motion.button>
      </form>
    </motion.div>
  );
};