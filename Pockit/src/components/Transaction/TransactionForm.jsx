import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { notify } from '../../utils/notifications';
import { slideUp } from '../../utils/animations';

export const TransactionForm = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [type, setType] = useState('pengeluaran');

  const handleSubmit = () => {
    if (!amount || !description) {
      notify.error('Mohon isi jumlah dan deskripsi!');
      return;
    }

    onAddTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type
    });

    notify.success(`Transaksi ${type} berhasil ditambahkan! 🎉`);
    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? 'Uang Saku' : 'Makanan');
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 
               rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        Tambah Transaksi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipe
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                     transition-all"
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </motion.select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                     transition-all"
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </motion.select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jumlah (Rp)
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                     placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deskripsi
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Makan siang"
            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                     placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 
                 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 
                 rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Tambah Transaksi
      </motion.button>
    </motion.div>
  );
};