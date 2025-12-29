import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Eye, Filter, Search, Star, Clock, User } from 'lucide-react';
import { ALL_SUBJECTS, type Subject } from '../utils/categories';
import { Toast } from './Toast';
import { summariesAPI } from '../../utils/supabaseClient';

interface Summary {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  fileUrl: string;
  subjectCode: string;
  uploadDate: string;
  downloads: number;
}

interface SummariesPageProps {
  onBack: () => void;
}

export function SummariesPage({ onBack }: SummariesPageProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(0); // 0 = all
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; messageAr: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadSummaries();
    // Refresh data every 3 seconds to show updates from Admin Dashboard
    const interval = setInterval(loadSummaries, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadSummaries = async () => {
    try {
      const { data, error } = await summariesAPI.getAll();
      
      if (error) {
        console.error('Error loading summaries:', error);
        setSummaries([]);
      } else if (data && data.length > 0) {
        setSummaries(data as Summary[]);
      } else {
        // If empty in Supabase, keep it empty - no defaults
        setSummaries([]);
      }
    } catch (err) {
      console.error('Error fetching summaries:', err);
      setSummaries([]);
    }
  };

  const saveSummaries = (newSummaries: Summary[]) => {
    setSummaries(newSummaries);
    localStorage.setItem('summaries', JSON.stringify(newSummaries));
  };

  const handleDownload = async (summary: Summary) => {
    // Check if fileUrl is valid
    if (!summary.fileUrl || summary.fileUrl === '#') {
      setToast({ message: 'No file available for download', messageAr: 'لا توجد ملف متاح للتحميل', type: 'error' });
      return;
    }
    
    // Update download count
    const updated = summaries.map(s =>
      s.id === summary.id ? { ...s, downloads: s.downloads + 1 } : s
    );
    saveSummaries(updated);
    setSummaries(updated);
    
    // Update in Supabase
    if (summary.id) {
      try {
        await summariesAPI.update(summary.id, { downloads: summary.downloads + 1 });
      } catch (error) {
        console.error('Error updating summary downloads:', error);
      }
    }
    
    // Trigger download
    const link = document.createElement('a');
    link.href = summary.fileUrl;
    link.download = summary.title || 'summary';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToast({ message: 'Download started', messageAr: 'بدأ التحميل', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل تريد حذف هذا الملخص؟\nDelete this summary?')) {
      const updated = summaries.filter(s => s.id !== id);
      saveSummaries(updated);
      
      // Delete from Supabase
      try {
        await summariesAPI.delete(id);
      } catch (error) {
        console.error('Error deleting summary:', error);
      }
      
      setToast({ message: 'Summary deleted successfully', messageAr: 'تم حذف الملخص بنجاح', type: 'success' });
    }
  };

  const filteredSummaries = selectedSubject === 'all'
    ? summaries
    : summaries.filter(s => s.subjectCode === selectedSubject);

  const levels = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-blue-400/20 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-200 font-semibold transition-all active:scale-95 border border-blue-400/30"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">رجوع</span>
              </button>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  📚 ملخصات EduFlow
                </h1>
                <p className="text-blue-300 text-sm md:text-base mt-1">أفضل الملخصات الدراسية من قبل المعلمين المتخصصين</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <h3 className="text-white font-semibold text-sm md:text-base">المستوى الدراسي</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedLevel(0)}
              className={`flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-lg font-semibold transition-all border ${
                selectedLevel === 0
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-400 shadow-lg'
                  : 'bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30'
              }`}
            >
              🎯 الكل
            </button>
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-lg font-semibold transition-all border whitespace-nowrap ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-400 shadow-lg'
                    : 'bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30'
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📚</span>
            <h3 className="text-white font-semibold text-sm md:text-base">المواد الدراسية</h3>
          </div>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`flex-shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all border text-sm md:text-base ${
                selectedSubject === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-emerald-400 shadow-lg'
                  : 'bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30'
              }`}
            >
              ✨ جميع المواد
            </button>
            {ALL_SUBJECTS
              .filter(s => selectedLevel === 0 || s.level === selectedLevel)
              .map(subject => (
              <button
                key={subject.code}
                onClick={() => setSelectedSubject(subject.code)}
                className={`flex-shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all border text-sm md:text-base whitespace-nowrap ${
                  selectedSubject === subject.code
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-emerald-400 shadow-lg'
                    : 'bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30'
                }`}
              >
                {subject.code}
              </button>
            ))}
          </div>
        </div>

        {/* Summaries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredSummaries.map(summary => (
            <div
              key={summary.id}
              className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-5 md:p-6 border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Icon Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all">
                  <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-2xl opacity-70">📄</div>
              </div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">{summary.titleAr}</h3>
              <p className="text-xs md:text-sm text-blue-300 mb-2">{summary.title}</p>
              <p className="text-sm md:text-base text-blue-100/80 mb-4 line-clamp-2">{summary.descriptionAr}</p>

              {/* Stats */}
              <div className="flex items-center justify-between text-blue-200/70 text-xs md:text-sm mb-4 pb-4 border-b border-blue-400/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📥</span>
                  <span>{summary.downloads} تحميل</span>
                </div>
                <span className="text-xs">{new Date(summary.uploadDate).toLocaleDateString('ar-EG')}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(summary)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </button>
                <button
                  onClick={() => setToast({ message: 'Preview coming soon', messageAr: 'المعاينة قريباً', type: 'info' })}
                  className="px-3 md:px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all active:scale-95 border border-blue-400/30 hover:border-blue-400"
                  title="معاينة الملخص"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSummaries.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="mb-4">
              <FileText className="w-20 h-20 mx-auto opacity-30 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد ملخصات</h3>
            <p className="text-blue-200 mb-6">لم نجد ملخصات تطابق البحث الخاص بك</p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedLevel(0);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all"
            >
              عرض جميع الملخصات
            </button>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} messageAr={toast.messageAr} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}