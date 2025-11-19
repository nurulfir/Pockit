import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Calendar, FileText } from 'lucide-react';

export const Expenditure = ({ onAddExpenditure, hideHeader = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'makanan',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const expenseCategories = [
    { value: 'makanan', label: 'Makanan', icon: '🍔' },
    { value: 'transportasi', label: 'Transportasi', icon: '🚗' },
    { value: 'belanja', label: 'Belanja', icon: '🛍️' },
    { value: 'tagihan', label: 'Tagihan', icon: '📱' },
    { value: 'hiburan', label: 'Hiburan', icon: '🎬' },
    { value: 'kesehatan', label: 'Kesehatan', icon: '🏥' },
    { value: 'pendidikan', label: 'Pendidikan', icon: '📚' },
    { value: 'lainnya', label: 'Lainnya', icon: '💸' },
  ];

  const handleSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Masukkan jumlah pengeluaran yang valid');
      return;
    }

    const expenditureData = {
      ...formData,
      amount: parseFloat(formData.amount),
      type: 'pengeluaran',
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    onAddExpenditure(expenditureData);

    // Reset form
    setFormData({
      amount: '',
      category: 'makanan',
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
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tambah Pengeluaran
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Catat pengeluaran Anda
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Jumlah Pengeluaran
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Contoh: 150000"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-all
            "
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {expenseCategories.map((cat) => (
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
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
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
              focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-all
            "
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
            placeholder="Contoh: Makan siang di restoran"
            rows={3}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-all
              resize-none
            "
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full py-3 rounded-xl
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            shadow-lg hover:shadow-red-500/50
            transition-all
          "
        >
          💸 Tambah Pengeluaran
        </motion.button>
      </div>
    </motion.div>
  );
};