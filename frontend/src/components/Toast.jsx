import { useState, useEffect } from 'react';

let showToastFn;

export function useToast() {
  return (message, type = 'success') => {
    if (showToastFn) showToastFn(message, type);
  };
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    showToastFn = (message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    };
  }, []);

  if (!toast) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${colors[toast.type]} text-white px-6 py-3 rounded-lg shadow-lg`}>
        {toast.message}
      </div>
    </div>
  );
}
