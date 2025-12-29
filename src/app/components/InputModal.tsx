import { useState } from 'react';
import { Plus } from 'lucide-react';

interface Field {
  id: string;
  label: string;
  labelAr: string;
  type?: 'text' | 'date' | 'time' | 'select';
  placeholder?: string;
  placeholderAr?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface InputModalProps {
  title: string;
  titleAr: string;
  fields: Field[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
}

export function InputModal({ title, titleAr, fields, onSubmit, onCancel }: InputModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.id]?.trim()) {
        return;
      }
    }
    
    onSubmit(formData);
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-white/20 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">{titleAr}</h2>
          <p className="text-white/70 text-center text-sm mb-6">{title}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.id}>
                <label className="block text-white/90 font-semibold mb-2 text-sm">
                  {field.labelAr} / {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-cyan-400 focus:outline-none text-white"
                    required={field.required}
                  >
                    <option value="" className="bg-gray-800">اختر / Select</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={`${field.placeholderAr || field.labelAr} / ${field.placeholder || field.label}`}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-white/40"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all active:scale-95"
              >
                إلغاء / Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all active:scale-95"
              >
                حفظ / Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
