// Helper functions untuk formatting
export const formatCurrency = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};