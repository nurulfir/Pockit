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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-start md:items-center justify-between glass rounded-2xl shadow-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Logo + Hamburger */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
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
        </div>

        {/* Hamburger untuk mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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

      {/* Right section - Desktop only */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-4 w-full space-y-4"
        >
          {/* Month Selector & Theme Toggle - Mobile */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            <ThemeToggle />
          </div>

          {/* Tabs - Mobile */}
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg font-medium text-sm w-full text-left flex items-center gap-2 transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};