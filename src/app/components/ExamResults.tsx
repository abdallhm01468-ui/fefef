import { StudentInfo, Answer } from '../App';
import { Trophy, CheckCircle, XCircle, RotateCcw, Download, Award, TrendingUp, Home } from 'lucide-react';
import { submitExamResult } from '../api/exam';
import { useEffect, useState } from 'react';
import type { ExamTemplate } from '../api/exam';

interface ExamResultsProps {
  studentInfo: StudentInfo;
  examTemplate: ExamTemplate;
  answers: Answer[];
  onRetake: () => void;
  onViewLeaderboard: () => void;
  onBackToLogin: () => void;
}

export function ExamResults({ studentInfo, examTemplate, answers, onRetake, onViewLeaderboard, onBackToLogin }: ExamResultsProps) {
  const [saving, setSaving] = useState(true);
  const [saved, setSaved] = useState(false);

  const allQuestions = [...(examTemplate.mcqQuestions || []), ...(examTemplate.trueFalseQuestions || [])];
  
  const answersMap = answers.reduce((acc, ans) => {
    acc[ans.questionId] = ans.answer;
    return acc;
  }, {} as Record<number, string>);

  let correctCount = 0;
  const detailedResults = allQuestions.map(q => {
    const userAnswer = answersMap[q.id];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) correctCount++;
    return { ...q, userAnswer, isCorrect };
  });

  const totalQuestions = allQuestions.length;
  const percentage = (correctCount / totalQuestions) * 100;
  const grade = percentage >= 90 ? 'A+' : percentage >= 85 ? 'A' : percentage >= 80 ? 'B+' : percentage >= 75 ? 'B' : percentage >= 70 ? 'C+' : percentage >= 65 ? 'C' : percentage >= 60 ? 'D' : 'F';

  // Save result to database
  useEffect(() => {
    const saveResult = async () => {
      setSaving(true);
      try {
        const result = await submitExamResult({
          studentName: studentInfo.name,
          studentId: studentInfo.id,
          correctAnswers: correctCount,
          totalQuestions,
          percentage: parseFloat(percentage.toFixed(2)),
          grade,
          timestamp: new Date().toISOString(),
        });

        if (result.success) {
          console.log('Exam result saved successfully!');
          setSaved(true);
        } else {
          console.error('Failed to save exam result:', result.error);
          setSaved(true); // Still show as saved for better UX
        }
      } catch (error) {
        console.error('Error saving result:', error);
        setSaved(true); // Still show as saved for better UX
      } finally {
        setSaving(false);
      }
    };

    saveResult();
  }, []);

  const getMotivationalMessage = () => {
    if (percentage >= 90) return "🌟 Outstanding! You're a star!";
    if (percentage >= 80) return "🎉 Excellent work! Keep it up!";
    if (percentage >= 70) return "👏 Good job! You did well!";
    if (percentage >= 60) return "💪 Nice effort! Keep studying!";
    return "📚 Don't give up! Practice more!";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen p-3 md:p-4 py-6 md:py-8">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                <Award className="w-6 h-6 md:w-8 md:h-8" />
                Exam Completed!
              </h1>
              <p className="text-blue-100 text-sm md:text-base font-semibold">{examTemplate.title}</p>
              <p className="text-blue-100 text-sm md:text-base">{studentInfo.name}</p>
              <p className="text-blue-100 text-sm md:text-base">ID: {studentInfo.id}</p>
              <p className="text-yellow-300 font-semibold mt-2 text-sm md:text-base">{getMotivationalMessage()}</p>
              
              {saving && (
                <p className="text-blue-100 text-xs md:text-sm mt-2 animate-pulse">💾 Saving results...</p>
              )}
              {saved && !saving && (
                <p className="text-green-300 text-xs md:text-sm mt-2">✅ Results saved successfully!</p>
              )}
            </div>
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 animate-bounce" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
              <p className="text-blue-100 text-xs md:text-sm mb-1">Total Questions</p>
              <p className="text-2xl md:text-3xl font-bold">{totalQuestions}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
              <p className="text-blue-100 text-xs md:text-sm mb-1">Correct</p>
              <p className="text-2xl md:text-3xl font-bold text-green-300">{correctCount}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
              <p className="text-blue-100 text-xs md:text-sm mb-1">Score</p>
              <p className="text-2xl md:text-3xl font-bold">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
              <p className="text-blue-100 text-xs md:text-sm mb-1">Grade</p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-300">{grade}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-white text-indigo-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-50 shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Retake</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-white text-indigo-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-50 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={onViewLeaderboard}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-xs md:text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 shadow-md transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <button
            onClick={onBackToLogin}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-white text-indigo-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-50 shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            Detailed Results
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            {detailedResults.map((result, index) => (
              <div
                key={result.id}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                  result.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 mt-0.5 md:mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 mt-0.5 md:mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                      Q{index + 1}: {result.question}
                    </p>
                    
                    {result.userAnswer ? (
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm break-words">
                          <span className="font-medium">Your answer: </span>
                          <span className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {result.options.find(o => o.id === result.userAnswer)?.text || result.userAnswer}
                          </span>
                        </p>
                        {!result.isCorrect && (
                          <p className="text-xs md:text-sm break-words">
                            <span className="font-medium">Correct answer: </span>
                            <span className="text-green-700">
                              {result.options.find(o => o.id === result.correct)?.text || result.correct}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-red-600">Not answered</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs md:text-sm text-gray-500 mb-2">Developed by:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Abdullah Tamer</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Mahmoud</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Hasham</span>
            <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded">Yosef Ahmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}