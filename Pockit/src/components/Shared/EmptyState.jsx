import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};