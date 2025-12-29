import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, FileText, Calendar, CheckCircle } from 'lucide-react';
import { getExamTemplates, deleteExamTemplate } from '../api/exam';
import type { ExamTemplate } from '../api/exam';

interface ExamManagerProps {
  onBack: () => void;
  onCreateExam: () => void;
  onEditExam: (template: ExamTemplate) => void;
}

export function ExamManager({ onBack, onCreateExam, onEditExam }: ExamManagerProps) {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getExamTemplates();
      if (data && Array.isArray(data)) {
        setTemplates(data);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error loading exam templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    const result = await deleteExamTemplate(templateId);
    if (result.success) {
      alert('Exam deleted successfully! ✅');
      fetchTemplates();
    } else {
      alert('Failed to delete exam: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-3 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3 justify-center md:justify-start">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                Exam Manager
              </h1>
              <p className="text-purple-200 text-sm md:text-base">Create and manage your exams</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateExam}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
          Create New Exam
        </button>

        {/* Exam List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading exams...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">No exams yet!</p>
              <p className="text-white/60 text-sm">Click "Create New Exam" to get started</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                All Exams ({templates.length})
              </h3>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg md:text-xl font-bold text-white mb-1 truncate">
                        {template.title}
                      </h4>
                      {template.description && (
                        <p className="text-purple-200 text-sm mb-2 line-clamp-2">{template.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                        <span className="flex items-center gap-1 text-blue-300">
                          <CheckCircle className="w-4 h-4" />
                          {template.mcqQuestions?.length || 0} MCQ
                        </span>
                        <span className="flex items-center gap-1 text-purple-300">
                          <CheckCircle className="w-4 h-4" />
                          {template.trueFalseQuestions?.length || 0} T/F
                        </span>
                        {template.updatedAt && (
                          <span className="flex items-center gap-1 text-white/60">
                            <Calendar className="w-4 h-4" />
                            {new Date(template.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={() => onEditExam(template)}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id!, template.title)}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs md:text-sm text-white/60 mb-2">Developed by:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">Abdullah Tamer</span>
            <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">Mahmoud</span>
            <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">Hasham</span>
            <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">Yosef Ahmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
