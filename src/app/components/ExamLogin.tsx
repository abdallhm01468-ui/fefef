import { useState, useEffect } from 'react';
import { StudentInfo } from '../App';
import { BookOpen, User, IdCard, Sparkles, Shield, FileText } from 'lucide-react';
import { getExamTemplates } from '../api/exam';
import type { ExamTemplate } from '../api/exam';
import { convertMcqQuestions, convertTrueFalseQuestions } from '../utils/convertQuestions';
import { convertACCT150McqQuestions, convertACCT150TrueFalseQuestions } from '../utils/convertACCT150Questions';
import { Toast } from './Toast';

interface ExamLoginProps {
  onLogin: (info: StudentInfo, selectedExam: ExamTemplate) => void;
  onViewAdmin: () => void;
}

export function ExamLogin({ onLogin, onViewAdmin }: ExamLoginProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [exams, setExams] = useState<ExamTemplate[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; messageAr: string; type: 'success' | 'error' | 'info' } | null>(null);

  const getDefaultExam = (): ExamTemplate => {
    return {
      id: 'default',
      title: 'Accounting Principles (ACCT 150) - Final Exam',
      description: 'Comprehensive 100-question exam covering all accounting fundamentals',
      mcqQuestions: convertACCT150McqQuestions(),
      trueFalseQuestions: convertACCT150TrueFalseQuestions(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const data = await getExamTemplates();
      
      const defaultExam = getDefaultExam();
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Add default exam first, then other exams
        setExams([defaultExam, ...data]);
        setSelectedExamId('default');
      } else {
        // Use only default exam if no exams available
        setExams([defaultExam]);
        setSelectedExamId('default');
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !id.trim()) {
      setToast({ message: 'Please enter your name and ID!', messageAr: 'يرجى إدخال اسمك ورقمك التعريفي!', type: 'error' });
      return;
    }

    if (!selectedExamId) {
      setToast({ message: 'Please select an exam!', messageAr: 'يرجى اختيار اختبار!', type: 'error' });
      return;
    }

    const selectedExam = exams.find(exam => exam.id === selectedExamId);
    if (selectedExam) {
      onLogin({ name: name.trim(), id: id.trim() }, selectedExam);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full animate-pulse">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">University Exam System</h1>
            <p className="text-sm md:text-base text-gray-600 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Select Your Exam and Start
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-sm">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No exams available yet!</p>
              <p className="text-gray-500 text-sm">Please contact the administrator.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                  Select Exam
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm md:text-base"
                >
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} ({(exam.mcqQuestions?.length || 0) + (exam.trueFalseQuestions?.length || 0)} Questions)
                    </option>
                  ))}
                </select>
                {selectedExamId && exams.find(e => e.id === selectedExamId)?.description && (
                  <p className="text-xs text-gray-600 mt-1 pl-1">
                    {exams.find(e => e.id === selectedExamId)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                  <IdCard className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                  Student ID
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your student ID"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm md:text-base"
              >
                Start Exam 🚀
              </button>
            </form>
          )}

          {exams.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-xs md:text-sm text-gray-700">
                <strong>Selected Exam:</strong><br />
                {selectedExamId && exams.find(e => e.id === selectedExamId) && (
                  <>
                    • {exams.find(e => e.id === selectedExamId)?.mcqQuestions?.length || 0} Multiple Choice Questions<br />
                    • {exams.find(e => e.id === selectedExamId)?.trueFalseQuestions?.length || 0} True/False Questions<br />
                    • Total: {(exams.find(e => e.id === selectedExamId)?.mcqQuestions?.length || 0) + (exams.find(e => e.id === selectedExamId)?.trueFalseQuestions?.length || 0)} Questions
                  </>
                )}
              </p>
            </div>
          )}

          {/* Admin Access Button */}
          <button
            onClick={onViewAdmin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </button>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 mb-2">Developed by:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Abdullah Tamer</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Mahmoud</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Hasham</span>
              <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded">Yosef Ahmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          messageAr={toast.messageAr}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}