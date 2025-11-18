import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                   transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
      />
      {value && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  );
};