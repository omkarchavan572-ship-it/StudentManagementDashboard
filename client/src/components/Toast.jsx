import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-500 text-white shadow-emerald-500/20',
    error: 'bg-rose-500 text-white shadow-rose-500/20',
    info: 'bg-brand-600 text-white shadow-brand-500/20',
    warning: 'bg-amber-500 text-white shadow-amber-500/20'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
        <button
          onClick={() => setToast(null)}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
