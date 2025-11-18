import toast from 'react-hot-toast';

export const notify = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontWeight: '600'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontWeight: '600'
      },
    });
  },

  info: (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '💡',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontWeight: '600'
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6366f1',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontWeight: '600'
      },
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};