import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  messageAr: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, messageAr, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <XCircle className="w-6 h-6" />;
      case 'info':
        return <Info className="w-6 h-6" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      case 'info':
        return 'from-blue-500 to-cyan-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`bg-gradient-to-r ${getColors()} text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-bold">{messageAr}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
