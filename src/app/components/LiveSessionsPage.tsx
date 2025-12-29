import { useState, useEffect } from 'react';
import { ArrowLeft, Radio, Calendar, Clock, Users, Plus, Trash2, Bell } from 'lucide-react';
import { Toast } from './Toast';
import { ConfirmModal } from './ConfirmModal';
import { livesAPI } from '../../utils/mongodbClient';

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

interface LiveSessionsPageProps {
  onBack: () => void;
}

export function LiveSessionsPage({ onBack }: LiveSessionsPageProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; messageAr: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [sessionModal, setSessionModal] = useState<LiveSession | null>(null);

  useEffect(() => {
    loadSessions();
    // Refresh data every 3 seconds to show updates from Admin Dashboard
    const interval = setInterval(loadSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await livesAPI.getAll();
      
      if (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
      } else if (data && data.length > 0) {
        setSessions(data as LiveSession[]);
      } else {
        // If empty in Supabase, keep it empty - no defaults
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setSessions([]);
    }
  };

  const loadDefaultSessions = async () => {
    const defaultSessions: LiveSession[] = [
      {
        id: '1',
        title: 'Financial Accounting Basics',
        titleAr: 'أساسيات المحاسبة المالية',
        description: 'Introduction to financial accounting principles',
        instructor: 'Dr. Ahmed Hassan',
        instructorAr: 'د. أحمد حسن',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '18:00',
        duration: '90 min',
        platform: 'Zoom',
        meetingUrl: 'https://zoom.us/j/example',
        status: 'upcoming',
        attendees: 45,
        maxAttendees: 100,
      },
      {
        id: '2',
        title: 'Cost Accounting Workshop',
        titleAr: 'ورشة عمل محاسبة التكاليف',
        description: 'Practical workshop on cost accounting',
        instructor: 'Prof. Sarah Mohamed',
        instructorAr: 'أ. سارة محمد',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        duration: '120 min',
        platform: 'Google Meet',
        meetingUrl: 'https://meet.google.com/example',
        status: 'live',
        attendees: 67,
        maxAttendees: 80,
      },
      {
        id: '3',
        title: 'Tax Accounting Q&A Session',
        titleAr: 'جلسة أسئلة وأجوبة المحاسبة الضريبية',
        description: 'Open Q&A session about tax accounting',
        instructor: 'Dr. Khaled Ali',
        instructorAr: 'د. خالد علي',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '20:00',
        duration: '60 min',
        platform: 'Zoom',
        meetingUrl: 'https://zoom.us/j/example',
        status: 'completed',
        attendees: 89,
        maxAttendees: 100,
      },
    ];
    setSessions(defaultSessions);
    
    // Save defaults to Supabase
    try {
      for (const session of defaultSessions) {
        await livesAPI.create(session);
      }
    } catch (error) {
      console.error('Error saving default sessions to Supabase:', error);
    }
  };

  const saveSessions = (newSessions: LiveSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('liveSessions', JSON.stringify(newSessions));
  };

  const handleJoinSession = (session: LiveSession) => {
    if (session.status === 'live') {
      // Open meeting URL directly for live sessions
      if (session.meetingUrl && session.meetingUrl !== '#' && session.meetingUrl !== '') {
        window.open(session.meetingUrl, '_blank');
      } else {
        setToast({ message: 'No meeting link available', messageAr: 'لا يوجد رابط اجتماع', type: 'error' });
      }
    } else if (session.status === 'upcoming') {
      // For upcoming sessions, register and redirect to instructor link
      if (session.meetingUrl && session.meetingUrl !== '#' && session.meetingUrl !== '') {
        // Increment attendees
        const updated = sessions.map(s =>
          s.id === session.id ? { ...s, attendees: Math.min(s.attendees + 1, s.maxAttendees) } : s
        );
        saveSessions(updated);
        setToast({ message: 'Registered successfully!', messageAr: 'تم تسجيل حضورك للجلسة!', type: 'success' });
        // Redirect to instructor link
        setTimeout(() => {
          window.open(session.meetingUrl, '_blank');
        }, 500);
      } else {
        setToast({ message: 'No meeting link available', messageAr: 'لا يوجد رابط محاضر', type: 'error' });
      }
    } else {
      setToast({ message: 'This session has ended', messageAr: 'هذه الجلسة انتهت', type: 'error' });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const updated = sessions.filter(s => s.id !== deleteId);
      saveSessions(updated);
      setDeleteId(null);
      
      // Delete from Supabase
      try {
        await livesAPI.delete(deleteId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
      
      setToast({ message: 'Session deleted successfully', messageAr: 'تم حذف الجلسة بنجاح', type: 'success' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'from-red-500 to-pink-600';
      case 'upcoming': return 'from-blue-500 to-cyan-600';
      case 'completed': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return { ar: '🔴 مباشر الآن', en: 'LIVE NOW' };
      case 'upcoming': return { ar: '📅 قادم', en: 'Upcoming' };
      case 'completed': return { ar: '✓ انتهى', en: 'Completed' };
      default: return { ar: '', en: '' };
    }
  };

  const filteredSessions = filter === 'all'
    ? sessions
    : sessions.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">رجوع</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Radio className="w-8 h-8" />
                  🔴 جلسات مباشرة EduFlow
                </h1>
                <p className="text-white/80 text-sm md:text-base">محاضرات مباشرة وجلسات تفاعلية</p>
              </div>
            </div>
            <button
              onClick={() => setToast({ message: 'أضف جلسة مباشرة جديدة', messageAr: 'استخدم لوحة الأدمن لإضافة جلسات', type: 'info' })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              إضافة جلسة
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all' as const, name: 'الكل', nameEn: 'All' },
            { id: 'live' as const, name: 'مباشر', nameEn: 'Live' },
            { id: 'upcoming' as const, name: 'قادم', nameEn: 'Upcoming' },
            { id: 'completed' as const, name: 'منتهي', nameEn: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                filter === tab.id
                  ? (tab.id === 'live' ? 'bg-white text-red-600 shadow-lg scale-105' : 'bg-white text-blue-600 shadow-lg scale-105')
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <div>{tab.name}</div>
              <div className="text-xs opacity-80">{tab.nameEn}</div>
            </button>
          ))}
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredSessions.map(session => {
            const statusText = getStatusText(session.status);
            return (
              <div
                key={session.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(session.status)} text-white font-bold text-sm shadow-lg ${session.status === 'live' ? 'animate-pulse' : ''}`}>
                    {statusText.ar}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{session.titleAr}</h3>
                <p className="text-sm md:text-base text-white/70 mb-1">{session.title}</p>
                <p className="text-xs md:text-sm text-white/60 mb-4">{session.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-white/10 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {session.instructorAr.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{session.instructorAr}</p>
                    <p className="text-white/60 text-xs">{session.instructor}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(session.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{session.time} - {session.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{session.attendees}/{session.maxAttendees}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Radio className="w-4 h-4" />
                    <span>{session.platform}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleJoinSession(session)}
                  disabled={session.status === 'completed'}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                    session.status === 'live'
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg animate-pulse'
                      : session.status === 'upcoming'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                      : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {session.status === 'live' && (
                    <>
                      <Radio className="w-5 h-5" />
                      انضم الآن
                    </>
                  )}
                  {session.status === 'upcoming' && (
                    <>
                      <Bell className="w-5 h-5" />
                      سجل حضورك
                    </>
                  )}
                  {session.status === 'completed' && (
                    <>
                      ✓ انتهت الجلسة
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">لا توجد جلسات مباشرة</p>
            <p className="text-sm">No live sessions available</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {deleteId !== null && (
        <ConfirmModal
          title="Delete Session"
          titleAr="حذف الجلسة"
          message="Are you sure you want to delete this session?"
          messageAr="هل تريد حذف هذه الجلسة؟"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

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