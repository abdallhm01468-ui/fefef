import { Trophy, Star, TrendingUp, RefreshCw, Home } from 'lucide-react';

interface ResultsPageProps {
  studentName: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  onRetakeExam: () => void;
}

export function ResultsPage({ studentName, studentId, score, totalQuestions, onRetakeExam }: ResultsPageProps) {
  // score is now the number of correct answers, not percentage
  const correctAnswers = score;
  const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : '0';
  const passed = parseFloat(percentage) >= 60;

  const getGrade = () => {
    const pct = parseFloat(percentage);
    if (pct >= 90) return { letter: 'A+', color: 'from-green-400 to-emerald-500', emoji: '🌟' };
    if (pct >= 85) return { letter: 'A', color: 'from-green-400 to-emerald-500', emoji: '⭐' };
    if (pct >= 80) return { letter: 'B+', color: 'from-blue-400 to-cyan-500', emoji: '👏' };
    if (pct >= 75) return { letter: 'B', color: 'from-blue-400 to-cyan-500', emoji: '👍' };
    if (pct >= 70) return { letter: 'C+', color: 'from-yellow-400 to-orange-500', emoji: '💪' };
    if (pct >= 60) return { letter: 'C', color: 'from-yellow-400 to-orange-500', emoji: '✅' };
    return { letter: 'F', color: 'from-red-400 to-pink-500', emoji: '😔' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20">
          {/* Confetti Effect */}
          {passed && (
            <div className="text-center text-4xl md:text-6xl mb-6 animate-bounce">
              🎉 {grade.emoji} 🎊
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${grade.color} mb-6 shadow-2xl`}>
              <Trophy className="w-10 h-10 md:w-14 md:h-14 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {passed ? 'مبروك! 🎉' : 'نتائجك 📊'}
            </h1>
            <p className="text-lg md:text-2xl text-blue-200">
              {passed ? 'ممتاز جداً على EduFlow!' : 'تحسين مستمر على EduFlow'}
            </p>
          </div>

          {/* Student Info */}
          <div className="bg-blue-500/20 rounded-2xl p-4 md:p-6 mb-6 border border-blue-400/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-blue-200 text-sm mb-1">الاسم / Name</p>
                  <p className="text-white font-bold text-lg">{studentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🆔</span>
                <div>
                  <p className="text-blue-200 text-sm mb-1">الرقم / ID</p>
                  <p className="text-white font-bold text-lg">{studentId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/10 rounded-2xl p-6 md:p-8 mb-6 border-2 border-blue-400/50">
            <div className="flex items-center justify-center gap-6 md:gap-8 mb-6">
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-bold text-emerald-400 mb-2">✅</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{score}</div>
                <div className="text-blue-200 text-sm md:text-base">صحيح / Correct</div>
              </div>
              <div className="text-4xl md:text-6xl text-blue-400/50">/</div>
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-bold text-blue-300 mb-2">📝</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{totalQuestions}</div>
                <div className="text-blue-200 text-sm md:text-base">سؤال / Questions</div>
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center mb-4">
              <div className={`inline-block px-8 py-4 rounded-2xl bg-gradient-to-r ${grade.color} shadow-lg`}>
                <div className="text-4xl md:text-6xl font-bold text-white">{percentage}%</div>
              </div>
            </div>

            {/* Grade */}
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-blue-500/30 rounded-xl border border-blue-400/50">
                <span className="text-blue-200 text-sm md:text-base mr-2">التقدير / Grade:</span>
                <span className="text-2xl md:text-3xl font-bold text-white">{grade.letter}</span>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`text-center mb-8 p-4 rounded-xl border ${passed ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-orange-500/20 border-orange-400/50'}`}>
            <p className="text-white font-semibold text-lg md:text-xl mb-2">
              {passed ? '✅ نجحت في الامتحان!' : '⚠️ للأسف لم تنجح'}
            </p>
            <p className="text-white/80 text-sm md:text-base">
              {passed
                ? `🎯 Great job! You passed with ${percentage}%`
                : `💪 You need 60% to pass. You scored ${percentage}%. حاول مرة أخرى!`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onRetakeExam}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all active:scale-95"
            >
              🔄 <RefreshCw className="w-5 h-5" />
              امتحان آخر
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-base md:text-lg transition-all active:scale-95 border border-white/30"
            >
              🏠 <Home className="w-5 h-5" />
              الصفحة الرئيسية
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-blue-300 text-sm">
            💻 Developed by Abdullah Tamer, Mahmoud, Hasham, Yosef Ahmed
          </p>
        </div>
      </div>
    </div>
  );
}
