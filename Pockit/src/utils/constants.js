export const CATEGORIES = {
  pemasukan: ['Uang Saku', 'Kerja Sampingan', 'Beasiswa', 'Lainnya'],
  pengeluaran: ['Makanan', 'Transport', 'Kuliah', 'Hiburan', 'Kebutuhan', 'Lainnya']
};

export const CATEGORY_COLORS = {
  'Makanan': '#FF6384',
  'Transport': '#36A2EB',
  'Kuliah': '#FFCE56',
  'Hiburan': '#4BC0C0',
  'Kebutuhan': '#9966FF',
  'Lainnya': '#FF9F40',
  'Uang Saku': '#00D9FF',
  'Kerja Sampingan': '#00FF88',
  'Beasiswa': '#FFD700',
};

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

// Financial Health Scoring Thresholds
export const HEALTH_SCORE_CONFIG = {
  EXCELLENT: { min: 80, label: 'Sangat Baik', color: 'green' },
  GOOD: { min: 60, label: 'Baik', color: 'blue' },
  FAIR: { min: 40, label: 'Cukup', color: 'yellow' },
  POOR: { min: 0, label: 'Perlu Perbaikan', color: 'red' }
};