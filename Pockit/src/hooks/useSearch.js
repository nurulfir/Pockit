import { useState, useMemo } from 'react';

export const useSearch = (items, searchFields) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const filteredItems = useMemo(() => {
    let result = items;

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        searchFields.some(field => 
          String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [items, searchTerm, filters, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredItems
  };
};