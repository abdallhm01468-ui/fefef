import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, ArrowLeft, TrendingUp } from 'lucide-react';
import { getLeaderboard } from '../api/exam';
import type { ExamResult } from '../api/exam';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard();
        if (data && Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">{index + 1}</span>;
  };

  const getRowColor = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (index === 2) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen p-3 md:p-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Back
            </button>
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-300 animate-bounce" />
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 flex items-center justify-center gap-3">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
            Top Performers
          </h1>
          <p className="text-center text-cyan-100 text-sm md:text-base">Best exam scores of all time</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading leaderboard...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No results yet!</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to complete the exam!</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.id || index}
                  className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border-2 ${getRowColor(index)} transition-all hover:shadow-md`}
                >
                  <div className="flex-shrink-0">
                    {getMedalIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm md:text-lg truncate">
                      {result.studentName}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 truncate">ID: {result.studentId}</p>
                    {result.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(result.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl md:text-2xl font-bold text-indigo-600">
                      {result.percentage.toFixed(1)}%
                    </div>
                    <div className={`text-xs md:text-sm font-semibold px-2 py-1 rounded ${
                      result.grade === 'A+' || result.grade === 'A' 
                        ? 'bg-green-100 text-green-700' 
                        : result.grade === 'B+' || result.grade === 'B'
                        ? 'bg-blue-100 text-blue-700'
                        : result.grade === 'C+' || result.grade === 'C'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      Grade: {result.grade}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {result.correctAnswers}/{result.totalQuestions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs md:text-sm text-gray-500 mb-2">Developed by:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Abdullah Tamer</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Mahmoud</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Hasham</span>
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">Yosef Ahmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}