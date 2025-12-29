import { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { saveExamTemplate } from '../api/exam';
import type { Question, ExamTemplate } from '../api/exam';
import { Toast } from './Toast';

interface ExamBuilderProps {
  onBack: () => void;
  existingTemplate?: ExamTemplate;
}

export function ExamBuilder({ onBack, existingTemplate }: ExamBuilderProps) {
  const [title, setTitle] = useState(existingTemplate?.title || '');
  const [description, setDescription] = useState(existingTemplate?.description || '');
  const [mcqQuestions, setMcqQuestions] = useState<Question[]>(
    existingTemplate?.mcqQuestions || []
  );
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<Question[]>(
    existingTemplate?.trueFalseQuestions || []
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'mcq' | 'truefalse'>('mcq');

  const addMcqQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correct: '',
      type: 'mcq',
    };
    setMcqQuestions([...mcqQuestions, newQuestion]);
  };

  const addTrueFalseQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: '',
      correct: '',
      type: 'truefalse',
    };
    setTrueFalseQuestions([...trueFalseQuestions, newQuestion]);
  };

  const updateMcqQuestion = (index: number, field: string, value: any) => {
    const updated = [...mcqQuestions];
    if (field === 'question' || field === 'correct') {
      updated[index] = { ...updated[index], [field]: value };
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      const options = [...(updated[index].options || [])];
      options[optionIndex] = value;
      updated[index] = { ...updated[index], options };
      
      // Reset correct answer if options changed
      if (updated[index].correct && !options.includes(updated[index].correct)) {
        updated[index].correct = '';
      }
    }
    setMcqQuestions(updated);
  };

  const updateTrueFalseQuestion = (index: number, field: string, value: any) => {
    const updated = [...trueFalseQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setTrueFalseQuestions(updated);
  };

  const deleteMcqQuestion = (index: number) => {
    setMcqQuestions(mcqQuestions.filter((_, i) => i !== index));
  };

  const deleteTrueFalseQuestion = (index: number) => {
    setTrueFalseQuestions(trueFalseQuestions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter exam title!\n\nمن فضلك أدخل عنوان الامتحان!');
      return;
    }

    if (mcqQuestions.length === 0 && trueFalseQuestions.length === 0) {
      alert('Please add at least one question!\n\nمن فضلك أضف سؤال واحد على الأقل!');
      return;
    }

    // Validate MCQ questions
    for (let i = 0; i < mcqQuestions.length; i++) {
      const q = mcqQuestions[i];
      
      if (!q.question.trim()) {
        alert(`MCQ Question ${i + 1}: Please enter the question text!\n\nسؤال ${i + 1}: من فضلك أدخل نص السؤال!`);
        return;
      }
      
      if (!q.options || q.options.some(o => !o.trim())) {
        alert(`MCQ Question ${i + 1}: Please fill all options!\n\nسؤال ${i + 1}: من فضلك املأ جميع الخيارات!`);
        return;
      }
      
      // Check for duplicate options
      const optionsSet = new Set(q.options.map(o => o.trim().toLowerCase()));
      if (optionsSet.size !== q.options.length) {
        alert(`MCQ Question ${i + 1}: Duplicate options detected! Each option must be unique.\n\nسؤال ${i + 1}: يوجد خيارات مكررة! يجب أن يكون كل خيار فريد.`);
        return;
      }
      
      if (!q.correct.trim()) {
        alert(`MCQ Question ${i + 1}: Please select the correct answer!\n\nسؤال ${i + 1}: من فضلك اختر الإجابة الصحيحة!`);
        return;
      }
    }

    // Validate True/False questions
    for (let i = 0; i < trueFalseQuestions.length; i++) {
      const q = trueFalseQuestions[i];
      
      if (!q.question.trim()) {
        alert(`T/F Question ${i + 1}: Please enter the question text!\n\nسؤال صح/خطأ ${i + 1}: من فضلك أدخل نص السؤال!`);
        return;
      }
      
      if (!q.correct) {
        alert(`T/F Question ${i + 1}: Please select the correct answer!\n\nسؤال صح/خطأ ${i + 1}: من فضلك اختر الإجابة الصحيحة!`);
        return;
      }
    }

    setSaving(true);

    const template: ExamTemplate = {
      id: existingTemplate?.id,
      title,
      description,
      mcqQuestions,
      trueFalseQuestions,
      createdAt: existingTemplate?.createdAt,
    };

    const result = await saveExamTemplate(template);

    setSaving(false);

    if (result.success) {
      alert('✅ Exam saved successfully!\n\nالامتحان تم حفظه بنجاح!');
      onBack();
    } else {
      alert('❌ Failed to save exam: ' + result.error + '\n\nفشل حفظ الامتحان!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-3 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3 justify-center md:justify-start">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-green-300" />
                {existingTemplate ? 'Edit Exam' : 'Create New Exam'}
              </h1>
              <p className="text-green-200 text-sm md:text-base">Build your custom accounting exam</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Back
            </button>
          </div>

          {/* Exam Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Exam Title <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Accounting Principles - Final Exam"
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/20 border-2 border-white/30 rounded-lg focus:border-green-300 focus:outline-none text-white placeholder-white/50 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the exam..."
                rows={2}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/20 border-2 border-white/30 rounded-lg focus:border-green-300 focus:outline-none text-white placeholder-white/50 text-sm md:text-base resize-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white text-center">
            <div className="text-2xl md:text-3xl font-bold">{mcqQuestions.length}</div>
            <div className="text-xs md:text-sm opacity-90">MCQ Questions</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white text-center">
            <div className="text-2xl md:text-3xl font-bold">{trueFalseQuestions.length}</div>
            <div className="text-xs md:text-sm opacity-90">True/False Questions</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeTab === 'mcq'
                ? 'bg-white text-teal-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => setActiveTab('truefalse')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeTab === 'truefalse'
                ? 'bg-white text-teal-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            True/False
          </button>
        </div>

        {/* Questions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20 max-h-[500px] overflow-y-auto">
          {activeTab === 'mcq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">Multiple Choice Questions</h3>
                <button
                  onClick={addMcqQuestion}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              {mcqQuestions.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No MCQ questions yet. Click "Add Question" to start!</p>
                </div>
              ) : (
                mcqQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white/10 rounded-lg p-3 md:p-4 border border-white/20 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-white font-bold text-sm md:text-base">Q{index + 1}</span>
                      <button
                        onClick={() => deleteMcqQuestion(index)}
                        className="text-red-300 hover:text-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateMcqQuestion(index, 'question', e.target.value)}
                      placeholder="Enter question..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 text-sm md:text-base resize-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          value={q.options?.[optIndex] || ''}
                          onChange={(e) => updateMcqQuestion(index, `option${optIndex}`, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          className="px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                        />
                      ))}
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs md:text-sm mb-1">Correct Answer:</label>
                      <select
                        value={q.correct}
                        onChange={(e) => updateMcqQuestion(index, 'correct', e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                      >
                        <option value="">Select correct answer</option>
                        {q.options?.map((opt, i) => (
                          <option key={i} value={opt} className="bg-gray-800">
                            {String.fromCharCode(65 + i)}: {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'truefalse' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">True/False Questions</h3>
                <button
                  onClick={addTrueFalseQuestion}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              {trueFalseQuestions.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No True/False questions yet. Click "Add Question" to start!</p>
                </div>
              ) : (
                trueFalseQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white/10 rounded-lg p-3 md:p-4 border border-white/20 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-white font-bold text-sm md:text-base">Q{index + 1}</span>
                      <button
                        onClick={() => deleteTrueFalseQuestion(index)}
                        className="text-red-300 hover:text-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateTrueFalseQuestion(index, 'question', e.target.value)}
                      placeholder="Enter question..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 text-sm md:text-base resize-none"
                    />
                    <div>
                      <label className="block text-white/80 text-xs md:text-sm mb-1">Correct Answer:</label>
                      <select
                        value={q.correct}
                        onChange={(e) => updateTrueFalseQuestion(index, 'correct', e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                      >
                        <option value="">Select correct answer</option>
                        <option value="True" className="bg-gray-800">True</option>
                        <option value="False" className="bg-gray-800">False</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 md:w-6 md:h-6" />
          {saving ? 'Saving...' : 'Save Exam'}
        </button>
      </div>
    </div>
  );
}