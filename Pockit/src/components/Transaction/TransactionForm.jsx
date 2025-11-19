import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { autoCategorize, suggestCategories } from '../../ai/categorizer';
import { notify } from '../../utils/notifications';
import { slideUp } from '../../utils/animations';

export const TransactionForm = ({ onAddTransaction, hideHeader = false }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [type, setType] = useState('pengeluaran');
  const [suggestions, setSuggestions] = useState([]);
  const [autoDetected, setAutoDetected] = useState(null);

  // Auto-categorize when description changes
  useEffect(() => {
    if (description.length > 3) {
      const result = autoCategorize(description, type);

      if (result.category && result.confidence > 60) {
        setAutoDetected(result);
        setCategory(result.category);
      } else {
        setAutoDetected(null);
      }

      const suggested = suggestCategories(description, type);
      setSuggestions(suggested);
    } else {
      setAutoDetected(null);
      setSuggestions([]);
    }
  }, [description, type]);

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

    if (autoDetected && autoDetected.confidence > 60) {
      notify.success(`✨ Transaksi ditambahkan! Auto-kategorisasi: ${category} (${autoDetected.confidence}% confident)`);
    } else {
      notify.success(`Transaksi ${type} berhasil ditambahkan! 🎉`);
    }

    setAmount('');
    setDescription('');
    setAutoDetected(null);
    setSuggestions([]);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? 'Uang Saku' : 'Makanan');
    setAutoDetected(null);
    setSuggestions([]);
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl p-6 backdrop-blur-sm bg-white/60 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700 shadow-md"
    >
      {/* header */}
      {!hideHeader && (
        <div className="mb-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Transaksi</h3>
            {autoDetected && (
              <div className="inline-flex items-center gap-2 mt-1 text-sm text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4" />
                <span>Auto: {autoDetected.category} ({autoDetected.confidence}%)</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe</label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah (Rp)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
            className="w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deskripsi</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Makan siang di warteg, Gojek ke kampus"
            className="w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
            {autoDetected && (
              <span className="ml-2 text-xs text-purple-600 dark:text-purple-300 font-semibold">(Auto)</span>
            )}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 focus:outline-none focus:ring-2 ${autoDetected ? 'focus:ring-purple-300' : 'focus:ring-indigo-300'} transition`}
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}{autoDetected && cat === autoDetected.category ? ' ✨' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && !autoDetected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">AI Suggestions</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setCategory(sug.category)}
                  className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/50 border border-white/10 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 hover:scale-105 transition"
                >
                  {sug.category} <span className="text-xs text-gray-500">({sug.confidence}%)</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg transition transform active:scale-98"
        >
          <div className="inline-flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </div>
        </button>
      </div>
    </motion.div>
  );
};
