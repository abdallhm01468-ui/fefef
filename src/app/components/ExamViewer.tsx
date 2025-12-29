import React, { useState } from 'react';
import { ChevronLeft, Clock, HelpCircle, Flag, RotateCcw } from 'lucide-react';
import { ACCT150Questions } from '../data/acct150FullExam';
import { Toast } from './Toast';

interface ExamState {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  flagged: Set<number>;
  timeLeft: number;
  isSubmitted: boolean;
  score: number;
}

interface ExamViewerProps {
  onBack: () => void;
}

export default function ExamViewer({ onBack }: ExamViewerProps) {
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: 0,
    answers: {},
    flagged: new Set(),
    timeLeft: 180 * 60, // 180 minutes in seconds
    isSubmitted: false,
    score: 0,
  });

  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  const currentQuestion = ACCT150Questions[examState.currentQuestion];
  const currentAnswer = examState.answers[examState.currentQuestion] || null;
  const isFlagged = examState.flagged.has(examState.currentQuestion);

  // Timer effect
  React.useEffect(() => {
    if (examState.isSubmitted) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeLeft <= 0) {
          handleSubmitExam();
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.isSubmitted]);

  const handleAnswerSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    if (examState.isSubmitted) return;

    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: option,
      },
    }));
  };

  const handleFlagQuestion = () => {
    setExamState((prev) => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(prev.currentQuestion)) {
        newFlagged.delete(prev.currentQuestion);
      } else {
        newFlagged.add(prev.currentQuestion);
      }
      return { ...prev, flagged: newFlagged };
    });
  };

  const handleNext = () => {
    if (examState.currentQuestion < ACCT150Questions.length - 1) {
      setExamState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (examState.currentQuestion > 0) {
      setExamState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const handleGoToQuestion = (qNum: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestion: qNum,
    }));
  };

  const handleSubmitExam = () => {
    let score = 0;
    ACCT150Questions.forEach((q, idx) => {
      if (examState.answers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / ACCT150Questions.length) * 100);
    setExamState((prev) => ({
      ...prev,
      isSubmitted: true,
      score: percentage,
    }));

    setNotification({
      type: 'success',
      message: `✅ امتحانك انتهى! النتيجة: ${percentage}%`,
    });
  };

  const handleRestart = () => {
    setExamState({
      currentQuestion: 0,
      answers: {},
      flagged: new Set(),
      timeLeft: 180 * 60,
      isSubmitted: false,
      score: 0,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(examState.answers).filter((a) => a !== null && a !== undefined).length;
  const progressPercentage = Math.round((answeredCount / ACCT150Questions.length) * 100);

  if (examState.isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              العودة
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-2 border-blue-200">
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  🎉 تم انتهاء الامتحان!
                </h2>
              </div>

              {/* Score Display */}
              <div className="mb-8">
                <div className="inline-block">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2">{examState.score}%</div>
                      <div className="text-white text-lg">النتيجة النهائية</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="mb-8">
                {examState.score >= 80 && (
                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-6">
                    <p className="text-emerald-700 text-lg font-semibold">
                      🌟 ممتاز! أداء رائع جداً!
                    </p>
                  </div>
                )}
                {examState.score >= 60 && examState.score < 80 && (
                  <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
                    <p className="text-blue-700 text-lg font-semibold">
                      ✅ جيد جداً! تمت بنجاح!
                    </p>
                  </div>
                )}
                {examState.score < 60 && (
                  <div className="bg-orange-50 border-2 border-orange-500 rounded-xl p-6">
                    <p className="text-orange-700 text-lg font-semibold">
                      📚 يمكنك المحاولة مرة أخرى لتحسين نتيجتك
                    </p>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(examState.answers).filter((a) => a).length}
                  </div>
                  <div className="text-slate-600 text-sm">أسئلة صحيحة</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {ACCT150Questions.length -
                      Object.values(examState.answers).filter((a) => a).length}
                  </div>
                  <div className="text-slate-600 text-sm">أسئلة خاطئة</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-slate-600">
                    {ACCT150Questions.length}
                  </div>
                  <div className="text-slate-600 text-sm">إجمالي الأسئلة</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  إعادة المحاولة
                </button>
                <button
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <Toast
            type={notification.type as 'success' | 'error' | 'info'}
            message={notification.message}
            messageAr={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              العودة
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">ACCT 150</h1>
            <p className="text-slate-600 mt-2">
              السؤال {examState.currentQuestion + 1} من {ACCT150Questions.length}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-2 border-blue-200">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-slate-900">{formatTime(examState.timeLeft)}</div>
              <div className="text-sm text-slate-600">الوقت المتبقي</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">التقدم</span>
            <span className="text-sm font-bold text-blue-600">{answeredCount}/{ACCT150Questions.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-blue-200">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {currentQuestion.category === 'mcq' && '📝 اختيار من متعدد'}
                  {currentQuestion.category === 'theory' && '📚 نظري'}
                  {currentQuestion.category === 'practical' && '🔧 عملي'}
                  {currentQuestion.category === 'calculation' && '🧮 حساب'}
                  {currentQuestion.category === 'truefalse' && '✓/✗ صح/خطأ'}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                {currentQuestion.text}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {(['A', 'B', 'C', 'D'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={examState.isSubmitted}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all flex items-center gap-3 ${
                      currentAnswer === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-400'
                    } ${examState.isSubmitted ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold ${
                        currentAnswer === option
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-400 text-slate-700'
                      }`}
                    >
                      {option}
                    </div>
                    <span className={`flex-1 ${currentAnswer === option ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
                      {currentQuestion.options[option]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleFlagQuestion}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isFlagged
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400'
                      : 'bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                  {isFlagged ? 'تم التعليم' : 'علّم للمراجعة'}
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={examState.currentQuestion === 0}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  السابق
                </button>
                <button
                  onClick={handleNext}
                  disabled={examState.currentQuestion === ACCT150Questions.length - 1}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  التالي
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  إنهاء الامتحان
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                الأسئلة
              </h3>

              <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                {ACCT150Questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGoToQuestion(idx)}
                    className={`w-full aspect-square rounded-lg font-bold text-sm transition-all flex items-center justify-center relative ${
                      idx === examState.currentQuestion
                        ? 'bg-blue-600 text-white ring-2 ring-blue-800'
                        : examState.answers[idx]
                          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {examState.flagged.has(idx) && (
                      <Flag className="w-3 h-3 absolute top-1 right-1 text-yellow-500 fill-yellow-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-100 border-2 border-slate-300 rounded" />
                  <span className="text-slate-600">لم تُجاب</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-400 rounded" />
                  <span className="text-slate-600">مُجاب</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-yellow-500" />
                  <span className="text-slate-600">معلّم</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Toast
          type={notification.type as 'success' | 'error' | 'info'}
          message={notification.message}
          messageAr={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
