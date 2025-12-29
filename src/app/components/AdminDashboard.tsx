import { useState, useEffect } from 'react';
import { Shield, LogOut, BookOpen, FileText, Video, Radio, Users, TrendingUp, Plus, Trash2, Tag, Settings, Download, Zap, BarChart3, Lock } from 'lucide-react';
import type { ExamTemplate } from '../api/exam';
import { getCategories, saveCategories, type Category } from '../utils/categories';
import { FormModal, Notification } from './FormModal';
import { QuestionFormModal } from './QuestionFormModal';
import { videosAPI, summariesAPI, livesAPI } from '../../utils/mongodbClient';

interface AdminDashboardProps {
  onBack: () => void;
}

type Tab = 'overview' | 'exams' | 'summaries' | 'videos' | 'lives' | 'categories' | 'settings' | 'analytics';
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Summary {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  fileUrl: string;
  subjectCode: string;
  uploadDate: string;
  downloads: number;
}

interface VideoItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  duration: string;
  uploadDate: string;
  views: number;
  type?: 'uploaded' | 'youtube';
}

interface LiveSession {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  instructor: string;
  instructorAr: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  meetingUrl: string;
  status: 'upcoming' | 'live' | 'completed';
  attendees: number;
  maxAttendees: number;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('overview');
  const [exams, setExams] = useState<ExamTemplate[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [lives, setLives] = useState<LiveSession[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Modal states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showAddQuestionsModal, setShowAddQuestionsModal] = useState(false);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState<string | null>(null);
  
  // Notification states
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load from Supabase
      const [summariesData, videosData, livesData] = await Promise.all([
        summariesAPI.getAll(),
        videosAPI.getAll(),
        livesAPI.getAll(),
      ]);

      if (summariesData.data) setSummaries(summariesData.data as Summary[]);
      if (videosData.data) setVideos(videosData.data as VideoItem[]);
      if (livesData.data) setLives(livesData.data as LiveSession[]);

      // Load exams from localStorage (not migrated yet)
      const storedExams = localStorage.getItem('examTemplates');
      if (storedExams) setExams(JSON.parse(storedExams));

      // Load categories from localStorage
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) setCategories(JSON.parse(storedCategories));
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage
      const storedExams = localStorage.getItem('examTemplates');
      if (storedExams) setExams(JSON.parse(storedExams));
      
      const storedSummaries = localStorage.getItem('summaries');
      if (storedSummaries) setSummaries(JSON.parse(storedSummaries));
      
      const storedVideos = localStorage.getItem('videos');
      if (storedVideos) setVideos(JSON.parse(storedVideos));
      
      const storedLives = localStorage.getItem('liveSessions');
      if (storedLives) setLives(JSON.parse(storedLives));
      
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) setCategories(JSON.parse(storedCategories));
    }
  };

  const showNotif = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  const handleAddSummary = async (data: Record<string, string>) => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      title: data.title,
      titleAr: data.titleAr,
      description: data.description,
      fileUrl: data.fileUrl,
      subjectCode: data.subjectCode,
      uploadDate: new Date().toISOString(),
      downloads: 0,
    };
    
    setIsLoading(true);
    try {
      // Save to MongoDB
      const { error } = await summariesAPI.create(newSummary);
      if (error) {
        console.error('Error adding summary to database:', error);
        console.log('Summary data sent:', newSummary);
        showNotif('error', `Error: ${error.message || 'Failed to save summary'}`);
        setIsLoading(false);
        return;
      }
      
      // Then update local state
      const updated = [...summaries, newSummary];
      setSummaries(updated);
      
      setShowSummaryModal(false);
      showNotif('success', 'تم إضافة الملخص بنجاح! / Summary added successfully!');
    } catch (error) {
      console.error('Error:', error);
      showNotif('error', `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSummary = async (id: string) => {
    if (confirm('حذف هذا الملخص؟ / Delete this summary?')) {
      try {
        // Delete from MongoDB first
        await summariesAPI.delete(id);
        
        // Then update local state
        const updated = summaries.filter(s => s.id !== id);
        setSummaries(updated);
        
        showNotif('success', 'تم الحذف بنجاح!');
      } catch (error) {
        console.error('Error deleting summary:', error);
        showNotif('error', 'خطأ في الحذف!');
      }
    }
  };

  const handleAddVideo = (data: Record<string, string>) => {
    // This handler is now replaced by the inline form in the modal
    // Keep it for reference but the main logic is in the video modal form above
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('حذف هذا الفيديو؟')) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      
      // Delete from MongoDB
      try {
        await videosAPI.delete(id);
        showNotif('success', 'تم الحذف بنجاح!');
      } catch (error) {
        console.error('Error deleting video:', error);
        showNotif('error', 'خطأ في الحذف!');
      }
    }
  };

  const handleAddLive = async (data: Record<string, string>) => {
    const newLive: LiveSession = {
      id: Date.now().toString(),
      title: data.title,
      titleAr: data.titleAr,
      description: data.description,
      instructor: data.instructor,
      instructorAr: data.instructorAr,
      date: data.date,
      time: data.time,
      duration: data.duration,
      platform: data.platform,
      meetingUrl: data.meetingUrl,
      status: 'upcoming',
      attendees: 0,
      maxAttendees: 100,
    };
    
    setIsLoading(true);
    try {
      // Save to MongoDB first
      const { error } = await livesAPI.create(newLive);
      if (error) {
        console.error('Error adding live session to database:', error);
        showNotif('error', 'خطأ في حفظ الجلسة! / Error saving session!');
        setIsLoading(false);
        return;
      }
      
      // Then update local state
      const updated = [...lives, newLive];
      setLives(updated);
      
      setShowLiveModal(false);
      showNotif('success', 'تم إضافة الجلسة بنجاح!');
    } catch (error) {
      console.error('Error:', error);
      showNotif('error', 'خطأ في الإضافة!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLive = async (id: string) => {
    if (confirm('حذف هذه الجلسة؟')) {
      const updated = lives.filter(l => l.id !== id);
      setLives(updated);
      
      // Delete from MongoDB
      try {
        await livesAPI.delete(id);
        showNotif('success', 'تم الحذف بنجاح!');
      } catch (error) {
        console.error('Error deleting live session:', error);
        showNotif('error', 'خطأ في الحذف!');
      }
    }
  };

  const handleUpdateLiveStatus = async (id: string, status: 'upcoming' | 'live' | 'completed') => {
    const updated = lives.map(l => l.id === id ? { ...l, status } : l);
    setLives(updated);
    localStorage.setItem('liveSessions', JSON.stringify(updated));
    
    // Update in Supabase
    try {
      await livesAPI.update(id, { status });
    } catch (error) {
      console.error('Error updating live session status:', error);
    }
  };

  const handleDeleteExam = (id: string) => {
    if (confirm('حذف هذا الامتحان؟')) {
      const updated = exams.filter(e => e.id !== id);
      setExams(updated);
      localStorage.setItem('examTemplates', JSON.stringify(updated));
      showNotif('success', 'تم الحذف بنجاح!');
    }
  };

  const handleAddQuestionsToExam = (data: Record<string, string>) => {
    if (!selectedExamForQuestions) return;
    
    // Log the data to verify what's being received
    console.log('Adding question with data:', data);
    
    // Validate that all required fields are filled
    if (!data.question || !data.correctAnswer) {
      showNotif('error', 'يجب ملء جميع الحقول المطلوبة!');
      return;
    }

    // For MCQ, validate options are filled
    if (data.questionType === 'mcq') {
      if (!data.optionA || !data.optionB || !data.optionC || !data.optionD) {
        showNotif('error', 'يجب ملء جميع الخيارات للأسئلة متعددة الاختيار!');
        return;
      }
    }
    
    const updated = exams.map(e => {
      if (e.id === selectedExamForQuestions) {
        let newQuestion: any;
        
        if (data.questionType === 'mcq') {
          newQuestion = {
            id: Date.now(),
            question: data.question.trim(),
            options: [
              data.optionA.trim(),
              data.optionB.trim(),
              data.optionC.trim(),
              data.optionD.trim()
            ],
            correct: data.correctAnswer.toUpperCase() === 'D' ? 'D' : data.correctAnswer.toUpperCase() === 'C' ? 'C' : data.correctAnswer.toUpperCase() === 'B' ? 'B' : 'A',
            type: 'mcq' as const,
          };
          return { ...e, mcqQuestions: [...(e.mcqQuestions || []), newQuestion] };
        } else {
          // True/False question
          newQuestion = {
            id: Date.now(),
            question: data.question.trim(),
            options: ['صحيح', 'خطأ'],
            correct: data.correctAnswer === 'خطأ' || data.correctAnswer.toUpperCase() === 'FALSE' ? 'خطأ' : 'صحيح',
            type: 'truefalse' as const,
          };
          return { ...e, trueFalseQuestions: [...(e.trueFalseQuestions || []), newQuestion] };
        }
      }
      return e;
    });
    
    setExams(updated);
    localStorage.setItem('examTemplates', JSON.stringify(updated));
    setShowAddQuestionsModal(false);
    setSelectedExamForQuestions(null);
    showNotif('success', 'تم إضافة السؤال بنجاح!');
  };

  const handleAddExam = (data: Record<string, string>) => {
    const newExam: ExamTemplate = {
      id: Date.now().toString(),
      title: data.title,
      subject: data.subject || 'General',
      level: parseInt(data.level) || 1,
      duration: parseInt(data.duration) || 60,
      passingScore: parseInt(data.passingScore) || 60,
      mcqQuestions: [],
      trueFalseQuestions: [],
      createdDate: new Date().toISOString(),
    };
    
    const updated = [...exams, newExam];
    setExams(updated);
    localStorage.setItem('examTemplates', JSON.stringify(updated));
    setShowExamModal(false);
    showNotif('success', 'تم إضافة الامتحان بنجاح!');
  };

  const totalExams = exams.length;
  const totalSummaries = summaries.length;
  const totalVideos = videos.length;
  const totalLives = lives.length;
  const totalStudents = 0;

  const tabs = [
    { id: 'overview' as Tab, name: 'Overview', nameAr: 'نظرة عامة', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'exams' as Tab, name: 'Exams', nameAr: 'الامتحانات', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'summaries' as Tab, name: 'Summaries', nameAr: 'الملخصات', icon: <FileText className="w-5 h-5" /> },
    { id: 'videos' as Tab, name: 'Videos', nameAr: 'الفيديوهات', icon: <Video className="w-5 h-5" /> },
    { id: 'lives' as Tab, name: 'Live Sessions', nameAr: 'اللايفات', icon: <Radio className="w-5 h-5" /> },
    { id: 'categories' as Tab, name: 'Categories', nameAr: 'الفئات', icon: <Tag className="w-5 h-5" /> },
    { id: 'analytics' as Tab, name: 'Analytics', nameAr: 'الإحصائيات', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings' as Tab, name: 'Settings', nameAr: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900">🛡️ لوحة التحكم</h1>
                <p className="text-slate-600 font-semibold">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-all duration-300 border border-slate-300"
            >
              <LogOut className="w-5 h-5" />
              خروج
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <BookOpen className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black">{totalExams}</div>
            <div className="text-sm font-semibold text-blue-100">الامتحانات</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <FileText className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black">{totalSummaries}</div>
            <div className="text-sm font-semibold text-emerald-100">الملخصات</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <Video className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black">{totalVideos}</div>
            <div className="text-sm font-semibold text-purple-100">الفيديوهات</div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <Radio className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black">{totalLives}</div>
            <div className="text-sm font-semibold text-red-100">اللايفات</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-amber-500 rounded-xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black">{totalStudents}</div>
            <div className="text-sm font-semibold text-yellow-100">الطلاب</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                currentTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <div>
                <div className="text-sm hidden md:block">{tab.nameAr}</div>
                <div className="text-xs">{tab.name}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Overview */}
          {currentTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">📊 نظرة عامة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">📈 الإحصائيات</h3>
                  <div className="space-y-3">
                    <p className="text-slate-700 font-semibold">📚 الامتحانات: <span className="text-blue-600">{totalExams}</span></p>
                    <p className="text-slate-700 font-semibold">📄 الملخصات: <span className="text-emerald-600">{totalSummaries}</span></p>
                    <p className="text-slate-700 font-semibold">🎥 الفيديوهات: <span className="text-purple-600">{totalVideos}</span></p>
                    <p className="text-slate-700 font-semibold">🔴 الجلسات: <span className="text-red-600">{totalLives}</span></p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">⚡ الإجراءات السريعة</h3>
                  <p className="text-slate-600 mb-4">✅ جميع الأنظمة تعمل بشكل صحيح</p>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all text-slate-700 font-semibold">📊 عرض الإحصائيات</button>
                    <button className="w-full text-left px-4 py-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all text-slate-700 font-semibold">📥 تحميل التقارير</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summaries */}
          {currentTab === 'summaries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">📚 الملخصات</h2>
                <button onClick={() => setShowSummaryModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-md">
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>
              <div className="space-y-3">
                {summaries.map(s => (
                  <div key={s.id} className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all border border-emerald-200">
                    <div><h3 className="font-bold text-slate-900">{s.titleAr}</h3><p className="text-sm text-slate-600">{s.title} • {s.subjectCode}</p></div>
                    <button onClick={() => handleDeleteSummary(s.id)} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
                {summaries.length === 0 && <p className="text-center py-8 text-slate-500 font-semibold">لا توجد ملخصات</p>}
              </div>
            </div>
          )}

          {/* Videos */}
          {currentTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🎥 الفيديوهات</h2>
                <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-md">
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>
              <div className="space-y-3">
                {videos.map(v => (
                  <div key={v.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all border border-purple-200">
                    <div><h3 className="font-bold text-slate-900">{v.titleAr}</h3><p className="text-sm text-slate-600">{v.title} • {v.category}</p></div>
                    <button onClick={() => handleDeleteVideo(v.id)} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
                {videos.length === 0 && <p className="text-center py-8 text-slate-500 font-semibold">لا توجد فيديوهات</p>}
              </div>
            </div>
          )}

          {/* Live Sessions */}
          {currentTab === 'lives' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🔴 الجلسات المباشرة</h2>
                <button onClick={() => setShowLiveModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md">
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>
              <div className="space-y-3">
                {lives.map(l => (
                  <div key={l.id} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 hover:shadow-md transition-all border border-red-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900">{l.titleAr}</h3>
                      <button onClick={() => handleDeleteLive(l.id)} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">📅 {l.date} • ⏰ {l.time} • 👨‍🏫 {l.instructor}</p>
                    <div className="flex gap-2">
                      {(['upcoming', 'live', 'completed'] as const).map(status => (
                        <button key={status} onClick={() => handleUpdateLiveStatus(l.id, status)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${l.status === status ? (status === 'live' ? 'bg-red-600 text-white animate-pulse shadow-lg' : status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-600 text-white') : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                          {status === 'upcoming' ? 'قادم' : status === 'live' ? 'مباشر' : 'منتهي'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {lives.length === 0 && <p className="text-center py-8 text-slate-500 font-semibold">لا توجد جلسات</p>}
              </div>
            </div>
          )}

          {/* Categories */}
          {currentTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🏷️ الفئات</h2>
                <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md">
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>
              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all border border-blue-200">
                    <div><h3 className="font-bold text-slate-900">{c.name}</h3><p className="text-sm text-slate-600">{c.nameEn}</p></div>
                    <button onClick={() => { if (confirm('حذف؟')) { const upd = categories.filter(x => x.id !== c.id); setCategories(upd); saveCategories(upd); showNotif('success', 'تم الحذف!'); }}} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {currentTab === 'settings' && (
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-6">⚙️ الإعدادات</h2>
              <div className="space-y-4">
                <button onClick={() => { const pwd = prompt('كلمة مرور جديدة:'); if (pwd && pwd.length >= 6) { localStorage.setItem('adminPassword', pwd); showNotif('success', 'تم التحديث!'); } else if (pwd) showNotif('error', 'يجب أن تكون 6 أحرف على الأقل'); }} className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" /> تغيير كلمة المرور
                </button>
                <button onClick={() => { if (confirm('حذف جميع البيانات؟')) { localStorage.clear(); loadAllData(); showNotif('success', 'تم الحذف!'); } }} className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-5 h-5" /> حذف جميع البيانات
                </button>
                <button onClick={() => { const data = JSON.stringify({ exams, summaries, videos, lives, categories }, null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); showNotif('success', 'تم التحميل!'); }} className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> نسخة احتياطية
                </button>
              </div>
            </div>
          )}

          {/* Exams */}
          {currentTab === 'exams' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">📝 الامتحانات</h2>
                <button onClick={() => setShowExamModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md">
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>
              <div className="space-y-3">
                {exams.map(e => (
                  <div key={e.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 hover:shadow-md transition-all border border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900">{e.title}</h3>
                        <p className="text-sm text-slate-600">{e.subject} • مستوى {e.level} • {e.mcqQuestions.length + e.trueFalseQuestions.length} سؤال</p>
                      </div>
                      <button onClick={() => handleDeleteExam(e.id!)} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/exam/${e.id}`} className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all text-center">
                        👁️ معاينة
                      </a>
                      <button 
                        onClick={() => {
                          setSelectedExamForQuestions(e.id!);
                          setShowAddQuestionsModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-all">
                        ➕ إضافة أسئلة
                      </button>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && <p className="text-center py-8 text-slate-500 font-semibold">لا توجد امتحانات</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-sm">
          <p>💻 Developed by Abdullah Tamer, Mahmoud, Hasham, Yosef Ahmed</p>
        </div>
      </div>

      {/* Modals */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">إضافة ملخص جديد</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const summaryFile = (formData.get('summaryFile') as File);
              const title = (formData.get('title') as string || '').trim();
              const titleAr = (formData.get('titleAr') as string || '').trim();
              const description = (formData.get('description') as string || '').trim();
              const subjectCode = (formData.get('subjectCode') as string || '').trim();
              
              if (summaryFile && summaryFile.size > 0) {
                // Convert file to base64
                const reader = new FileReader();
                reader.onload = async (event) => {
                  const finalUrl = event.target?.result as string;
                  
                  const newSummary: Summary = {
                    id: Date.now().toString(),
                    title: title,
                    titleAr: titleAr,
                    description: description,
                    fileUrl: finalUrl,
                    subjectCode: subjectCode,
                    uploadDate: new Date().toISOString(),
                    downloads: 0,
                  };
                  
                  const updated = [...summaries, newSummary];
                  setSummaries(updated);
                  
                  // Save to MongoDB
                  try {
                    await summariesAPI.create(newSummary);
                    setShowSummaryModal(false);
                    showNotif('success', 'تم إضافة الملخص بنجاح!');
                  } catch (error) {
                    console.error('Error saving summary:', error);
                    showNotif('error', 'خطأ في حفظ الملخص!');
                  }
                };
                reader.readAsDataURL(summaryFile);
              } else {
                showNotif('error', 'الرجاء تحديد ملف!');
              }
            }} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">English Title</label>
                <input name="title" type="text" placeholder="Title" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">العنوان بالعربي</label>
                <input name="titleAr" type="text" placeholder="العنوان" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Subject Code</label>
                <input name="subjectCode" type="text" placeholder="BADM 100" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea name="description" placeholder="الوصف" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1">رفع الملخص (PDF/Word)</label>
                <input name="summaryFile" type="file" accept=".pdf,.doc,.docx" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
                  إضافة
                </button>
                <button type="button" onClick={() => setShowSummaryModal(false)} className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-lg font-bold transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">إضافة فيديو جديد</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const videoFile = (formData.get('videoFile') as File);
              const videoUrl = (formData.get('videoUrl') as string || '').trim();
              const title = (formData.get('title') as string || '').trim();
              const titleAr = (formData.get('titleAr') as string || '').trim();
              const description = (formData.get('description') as string || '').trim();
              const category = (formData.get('category') as string || '').trim();
              const duration = (formData.get('duration') as string || '').trim();
              
              // Use either uploaded file or YouTube URL
              if (videoFile && videoFile.size > 0) {
                // Convert file to base64 for storage
                const reader = new FileReader();
                reader.onload = async (event) => {
                  const finalUrl = event.target?.result as string;
                  
                  const newVideo: VideoItem = {
                    id: Date.now().toString(),
                    title: title,
                    titleAr: titleAr,
                    description: description,
                    videoUrl: finalUrl,
                    thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2256%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%2256%22/%3E%3C/svg%3E',
                    category: category,
                    duration: duration,
                    uploadDate: new Date().toISOString(),
                    views: 0,
                    type: 'uploaded',
                  };
                  
                  const updated = [...videos, newVideo];
                  setVideos(updated);
                  
                  // Save to MongoDB
                  try {
                    await videosAPI.create(newVideo);
                    setShowVideoModal(false);
                    showNotif('success', 'تم إضافة الفيديو بنجاح!');
                  } catch (error) {
                    console.error('Error saving video:', error);
                    showNotif('error', 'خطأ في حفظ الفيديو!');
                  }
                };
                reader.readAsDataURL(videoFile);
              } else if (videoUrl) {
                // Convert YouTube URL to embed URL
                let embedUrl = videoUrl;
                if (videoUrl.includes('youtube.com/watch')) {
                  const videoId = videoUrl.split('v=')[1]?.split('&')[0];
                  if (videoId) {
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  }
                } else if (videoUrl.includes('youtu.be/')) {
                  const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                  if (videoId) {
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  }
                }
                
                const newVideo: VideoItem = {
                  id: Date.now().toString(),
                  title: title,
                  titleAr: titleAr,
                  description: description,
                  videoUrl: embedUrl,
                  thumbnail: videoUrl.includes('youtube') ? `https://img.youtube.com/vi/${embedUrl.split('/').pop()}/maxresdefault.jpg` : '',
                  category: category,
                  duration: duration,
                  uploadDate: new Date().toISOString(),
                  views: 0,
                  type: 'youtube',
                };
                
                const updated = [...videos, newVideo];
                setVideos(updated);
                
                // Save to MongoDB
                (async () => {
                  try {
                    await videosAPI.create(newVideo);
                    setShowVideoModal(false);
                    showNotif('success', 'تم إضافة الفيديو بنجاح!');
                  } catch (error) {
                    console.error('Error saving video:', error);
                    showNotif('error', 'خطأ في حفظ الفيديو!');
                  }
                })();
              } else {
                showNotif('error', 'يجب اختيار ملف فيديو أو إدراج رابط YouTube!');
              }
            }} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">English Title</label>
                <input name="title" type="text" placeholder="Title" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">العنوان بالعربي</label>
                <input name="titleAr" type="text" placeholder="العنوان" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">رفع الفيديو</label>
                <input name="videoFile" type="file" accept="video/*" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">أو رابط YouTube</label>
                <input name="videoUrl" type="text" placeholder="https://youtube.com/watch?v=..." className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea name="description" placeholder="Desc" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input name="category" type="text" placeholder="e.g., accounting" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Duration</label>
                <input name="duration" type="text" placeholder="15:30" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
                  إضافة
                </button>
                <button type="button" onClick={() => setShowVideoModal(false)} className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-lg font-bold transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FormModal
        isOpen={showLiveModal}
        title="إضافة جلسة مباشرة / Add Live Session"
        fields={[
          { name: 'title', label: 'English Title', placeholder: 'Title', required: true },
          { name: 'titleAr', label: 'العنوان بالعربي', placeholder: 'العنوان', required: true },
          { name: 'description', label: 'Description', placeholder: 'Desc', type: 'textarea' },
          { name: 'instructor', label: 'Instructor', placeholder: 'Name', required: true },
          { name: 'instructorAr', label: 'اسم المحاضر', placeholder: 'الاسم' },
          { name: 'date', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-15', required: true },
          { name: 'time', label: 'Time (HH:MM)', placeholder: '14:30', required: true },
          { name: 'duration', label: 'Duration', placeholder: '90 min' },
          { name: 'platform', label: 'Platform', placeholder: 'Zoom', required: true },
          { name: 'meetingUrl', label: 'Meeting URL', placeholder: 'https://...' },
        ]}
        onSubmit={handleAddLive}
        onClose={() => setShowLiveModal(false)}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={showCategoryModal}
        title="إضافة فئة جديدة / Add Category"
        fields={[
          { name: 'id', label: 'Category ID', placeholder: 'accounting', required: true },
          { name: 'name', label: 'الاسم بالعربي', placeholder: 'محاسبة', required: true },
          { name: 'nameEn', label: 'English Name', placeholder: 'Accounting', required: true },
        ]}
        onSubmit={(data) => {
          const newCat: Category = { id: data.id, name: data.name, nameEn: data.nameEn };
          const upd = [...categories, newCat];
          setCategories(upd);
          saveCategories(upd);
          setShowCategoryModal(false);
          showNotif('success', 'تم الإضافة!');
        }}
        onClose={() => setShowCategoryModal(false)}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={showExamModal}
        title="إضافة امتحان جديد / Add Exam"
        fields={[
          { name: 'title', label: 'Exam Title', placeholder: 'Final Exam', required: true },
          { name: 'subject', label: 'Subject', placeholder: 'Accounting 100', required: true },
          { name: 'level', label: 'Level', placeholder: '1-4', required: true },
          { name: 'duration', label: 'Duration (minutes)', placeholder: '60', required: true },
          { name: 'passingScore', label: 'Passing Score (%)', placeholder: '60', required: true },
        ]}
        onSubmit={handleAddExam}
        onClose={() => setShowExamModal(false)}
        isLoading={isLoading}
      />

      <QuestionFormModal
        isOpen={showAddQuestionsModal}
        onClose={() => {
          setShowAddQuestionsModal(false);
          setSelectedExamForQuestions(null);
        }}
        onSubmit={handleAddQuestionsToExam}
        isLoading={isLoading}
      />

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
