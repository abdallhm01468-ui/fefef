import { useState, useEffect } from 'react';
import { BookOpen, User, IdCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { getExamTemplates, type ExamTemplate } from '../api/exam';
import { ALL_SUBJECTS } from '../utils/categories';

interface ExamSelectorProps {
  onStart: (name: string, id: string, examId: string) => void;
  onBack: () => void;
}

export function ExamSelector({ onStart, onBack }: ExamSelectorProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [exams, setExams] = useState<ExamTemplate[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const templates = await getExamTemplates();
      console.log('Loaded exams from API:', templates);
      
      // Check if ACCT 150 exists, if not create a default one
      const hasACCT150 = templates.some(t => t.title.includes('ACCT 150') || t.subject === 'ACCT 150');
      console.log('Has ACCT 150:', hasACCT150);
      
      let examsToUse = templates;
      if (!hasACCT150 && templates.length === 0) {
        // Create default ACCT 150 exam if no exams exist
        const defaultACCT150: ExamTemplate = {
          id: 'acct150-default',
          title: 'ACCT 150',
          subject: 'ACCT 150',
          level: 1,
          duration: 120,
          passingScore: 60,
          mcqQuestions: [],
          trueFalseQuestions: [],
          createdDate: new Date().toISOString(),
        };
        examsToUse = [defaultACCT150];
        console.log('Created default ACCT 150 exam');
        // Save to localStorage
        localStorage.setItem('examTemplates', JSON.stringify(examsToUse));
      }
      
      console.log('Exams to use:', examsToUse);
      if (examsToUse.length > 0) {
        setExams(examsToUse);
        setSelectedExamId(examsToUse[0].id || '');
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && id.trim() && selectedExamId) {
      onStart(name, id, selectedExamId);
    }
  };

  const filteredExams = exams.filter(exam => {
    if (selectedSubject !== 'all') {
      // Match by exact subject name or by matching the subject code in the title
      const matchByExactSubject = exam.subject === selectedSubject;
      const matchByTitle = exam.title.includes(selectedSubject);
      return matchByExactSubject || matchByTitle;
    }
    return true;
  });

  const levels = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg text-white font-semibold transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 mb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 mb-4 shadow-lg animate-pulse">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              ✏️ اختر امتحانك على EduFlow
            </h1>
            <p className="text-blue-200 text-sm md:text-base">🎯 اختر الامتحان وابدأ الاختبار الآن</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-blue-200 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                👤 الاسم الكامل / Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك / Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-blue-300/50 text-sm md:text-base transition-all"
                  required
                />
              </div>
            </div>

            {/* ID Input */}
            <div>
              <label className="block text-blue-200 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                🆔 رقم الطالب / Student ID
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="أدخل رقم الطالب / Enter your ID"
                  className="w-full pl-10 pr-4 py-3 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-blue-300/50 text-sm md:text-base transition-all"
                  required
                />
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-blue-200 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                📊 المستوى / Level
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedLevel(0)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold transition-all border whitespace-nowrap ${
                    selectedLevel === 0
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-300 shadow-lg'
                      : 'bg-blue-500/30 text-blue-200 border-blue-400/50 hover:bg-blue-500/50'
                  }`}
                >
                  🎯 الكل / All
                </button>
                {levels.map(level => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap border ${
                      selectedLevel === level
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-300 shadow-lg'
                        : 'bg-blue-500/30 text-blue-200 border-blue-400/50 hover:bg-blue-500/50'
                    }`}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-blue-200 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                📚 المادة / Subject
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 max-h-32">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubject('all')}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm border ${
                      selectedSubject === 'all'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 text-white border-emerald-300 shadow-lg'
                        : 'bg-blue-500/30 text-blue-200 border-blue-400/50 hover:bg-blue-500/50'
                    }`}
                  >
                    ✨ الكل / All
                  </button>
                  {ALL_SUBJECTS
                    .filter(s => selectedLevel === 0 || s.level === selectedLevel)
                    .map(subject => (
                    <button
                      type="button"
                      key={subject.code}
                      onClick={() => setSelectedSubject(subject.code)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap text-sm border ${
                        selectedSubject === subject.code
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 text-white border-emerald-300 shadow-lg'
                          : 'bg-blue-500/30 text-blue-200 border-blue-400/50 hover:bg-blue-500/50'
                      }`}
                    >
                      {subject.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exam Selection */}
            <div>
              {loading ? (
                <div className="text-center py-4 text-blue-300 flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> جاري التحميل...
                </div>
              ) : filteredExams.length > 0 ? (
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-4 py-3 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl focus:border-cyan-400 focus:outline-none text-white text-sm md:text-base transition-all"
                  required
                >
                  {filteredExams.map((exam) => (
                    <option key={exam.id} value={exam.id} className="bg-slate-900">
                      📋 {exam.title} ({exam.mcqQuestions.length + exam.trueFalseQuestions.length} أسئلة)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-4 text-blue-300 text-sm bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  ❌ لا توجد امتحانات في هذا القسم
                  <br />
                  No exams available in this section
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim() || !id.trim() || !selectedExamId || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 ابدأ الامتحان
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </form>
        </div>

        {/* Developer Credit */}
        <div className="text-center text-blue-300 text-sm">
          <p>💻 Developed by Abdullah Tamer, Mahmoud, Hasham, Yosef Ahmed</p>
        </div>
      </div>
    </div>
  );
}
