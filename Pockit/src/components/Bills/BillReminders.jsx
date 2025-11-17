import { useState } from 'react';
import { Bell, Plus, Check, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BillReminders = ({ bills, onAdd, onMarkPaid, onDelete, upcomingBills }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Kuliah'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.dueDate) {
      alert('Mohon isi semua field!');
      return;
    }

    onAdd({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    setFormData({ name: '', amount: '', dueDate: '', category: 'Kuliah' });
    setShowForm(false);
  };

  const pendingBills = bills.filter(b => b.status === 'pending');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">Bill Reminders</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </button>
      </div>

      {upcomingBills.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold">Upcoming Bills (Next 7 days)</h3>
          </div>
          <div className="space-y-2">
            {upcomingBills.map(bill => (
              <div key={bill.id} className="flex justify-between items-center text-sm">
                <span className="font-semibold">{bill.name}</span>
                <span className="text-orange-600">{formatCurrency(bill.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Bill name (e.g., SPP Semester)"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Amount"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Add Bill Reminder
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pendingBills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada tagihan. Good job! 👍
          </p>
        ) : (
          pendingBills.map(bill => {
            const dueDate = new Date(bill.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

            return (
              <div
                key={bill.id}
                className={`border-2 rounded-lg p-4 ${
                  isOverdue ? 'border-red-300 bg-red-50' :
                  isDueSoon ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{bill.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(bill.amount)} • {formatDate(bill.dueDate)}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${
                      isOverdue ? 'text-red-600' :
                      isDueSoon ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days!` :
                       isDueSoon ? `Due in ${daysUntilDue} days` :
                       `Due in ${daysUntilDue} days`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkPaid(bill.id)}
                      className="text-green-600 hover:text-green-800 bg-green-100 p-2 rounded-lg transition"
                      title="Mark as paid"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(bill.id)}
                      className="text-red-600 hover:text-red-800 bg-red-100 p-2 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};