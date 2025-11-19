import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MonthSelector } from '../Dashboard/MonthSelector';
import { slideDown } from '../../utils/animations';

export const Header = ({
  tabs,
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  onAddTransaction,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-start md:items-center justify-between glass rounded-2xl shadow-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Logo + Tabs */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.4 }}
          className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 shadow-sm"
        >
          <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </motion.div>

        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Pocket <span className="text-indigo-600 dark:text-indigo-400">IT</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
            Smart Finance Manager
          </p>
        </div>

        {/* Hamburger untuk mobile */}
        <button
          className="ml-auto md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Tabs untuk desktop */}
        <div className="hidden md:flex gap-2 ml-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <ThemeToggle />
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        <button
          onClick={onAddTransaction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Transaksi
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg font-medium text-sm w-full text-left ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}
    </motion.header>
  );
};
