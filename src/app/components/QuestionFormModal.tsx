import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  isLoading?: boolean;
}

export function QuestionFormModal({ isOpen, onClose, onSubmit, isLoading = false }: QuestionFormModalProps) {
  const [questionType, setQuestionType] = useState<'mcq' | 'truefalse'>('mcq');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!question.trim()) {
      newErrors.question = 'السؤال مطلوب';
    }

    if (questionType === 'mcq') {
      if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
        newErrors.options = 'جميع الخيارات مطلوبة لأسئلة الاختيار من متعدد';
      }
    }

    if (!correctAnswer) {
      newErrors.correctAnswer = 'الإجابة الصحيحة مطلوبة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: Record<string, string> = {
      questionType,
      question: question.trim(),
      correctAnswer,
    };

    if (questionType === 'mcq') {
      data.optionA = optionA.trim();
      data.optionB = optionB.trim();
      data.optionC = optionC.trim();
      data.optionD = optionD.trim();
    }

    onSubmit(data);
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setQuestionType('mcq');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">إضافة سؤال جديد</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع السؤال / Question Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="mcq"
                  checked={questionType === 'mcq'}
                  onChange={() => {
                    setQuestionType('mcq');
                    setCorrectAnswer('A');
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">اختيار من متعدد (MCQ)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="truefalse"
                  checked={questionType === 'truefalse'}
                  onChange={() => {
                    setQuestionType('truefalse');
                    setCorrectAnswer('صحيح');
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">صحيح/خطأ (True/False)</span>
              </label>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السؤال / Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question}
              onChange={e => {
                setQuestion(e.target.value);
                if (errors.question) setErrors(prev => ({ ...prev, question: '' }));
              }}
              placeholder="اكتب السؤال هنا..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              rows={3}
            />
            {errors.question && <p className="text-xs text-red-500 mt-1">{errors.question}</p>}
          </div>

          {/* Options Section - Show only for MCQ */}
          {questionType === 'mcq' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخيار أ / Option A <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={e => {
                      setOptionA(e.target.value);
                      if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
                    }}
                    placeholder="الخيار الأول"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخيار ب / Option B <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={e => {
                      setOptionB(e.target.value);
                      if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
                    }}
                    placeholder="الخيار الثاني"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخيار ج / Option C <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionC}
                    onChange={e => {
                      setOptionC(e.target.value);
                      if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
                    }}
                    placeholder="الخيار الثالث"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخيار د / Option D <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionD}
                    onChange={e => {
                      setOptionD(e.target.value);
                      if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
                    }}
                    placeholder="الخيار الرابع"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              {errors.options && <p className="text-xs text-red-500 mt-1">{errors.options}</p>}
            </>
          )}

          {/* Correct Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الإجابة الصحيحة / Correct Answer <span className="text-red-500">*</span>
            </label>
            {questionType === 'mcq' ? (
              <div className="flex gap-4">
                {['A', 'B', 'C', 'D'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={option}
                      checked={correctAnswer === option}
                      onChange={e => {
                        setCorrectAnswer(e.target.value);
                        if (errors.correctAnswer) setErrors(prev => ({ ...prev, correctAnswer: '' }));
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 font-semibold">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex gap-4">
                {['صحيح', 'خطأ'].map(answer => (
                  <label key={answer} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={answer}
                      checked={correctAnswer === answer}
                      onChange={e => {
                        setCorrectAnswer(e.target.value);
                        if (errors.correctAnswer) setErrors(prev => ({ ...prev, correctAnswer: '' }));
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{answer}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.correctAnswer && <p className="text-xs text-red-500 mt-1">{errors.correctAnswer}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'جاري الحفظ...' : 'حفظ السؤال'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
