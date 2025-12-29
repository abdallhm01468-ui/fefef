import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ title, titleAr, message, messageAr, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">{titleAr}</h2>
          <p className="text-white/70 text-center text-sm mb-1">{title}</p>
          
          <div className="bg-white/10 rounded-lg p-4 my-4">
            <p className="text-white text-center mb-1">{messageAr}</p>
            <p className="text-white/70 text-center text-sm">{message}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all active:scale-95"
            >
              إلغاء / Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all active:scale-95"
            >
              تأكيد / Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
