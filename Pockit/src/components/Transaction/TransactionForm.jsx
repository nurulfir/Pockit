import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

export const TransactionForm = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [type, setType] = useState('pengeluaran');

  const handleSubmit = () => {
    if (!amount || !description) {
      alert('Mohon isi jumlah dan deskripsi!');
      return;
    }

    onAddTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type
    });

    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? 'Uang Saku' : 'Makanan');
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        Tambah Transaksi
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe
          </label>
          <select 
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          >
            {CATEGORIES[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah (Rp)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Makan siang"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Tambah Transaksi
      </button>
    </div>
  );
};