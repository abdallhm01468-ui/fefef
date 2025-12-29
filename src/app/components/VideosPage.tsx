import { useState, useEffect } from 'react';
import { ArrowLeft, Video, Play, Eye } from 'lucide-react';
import { ALL_SUBJECTS } from '../utils/categories';
import { videosAPI } from '../../utils/supabaseClient';

interface VideoItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  videoUrl: string;
  thumbnail: string;
  subjectCode?: string;
  category?: string;
  duration: string;
  uploadDate: string;
  views: number;
  type?: 'uploaded' | 'youtube';
}

interface VideosPageProps {
  onBack: () => void;
}

export function VideosPage({ onBack }: VideosPageProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    // Load videos from Supabase on component mount
    const loadVideos = async () => {
      try {
        const { data, error } = await videosAPI.getAll();
        
        if (error) {
          console.error('Error loading videos:', error);
          setVideos([]);
        } else if (data && data.length > 0) {
          setVideos(data as VideoItem[]);
        } else {
          // If empty in Supabase, keep it empty - no defaults
          setVideos([]);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setVideos([]);
      }
    };

    loadVideos();
    // Refresh data every 3 seconds to show updates from Admin Dashboard
    const interval = setInterval(loadVideos, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveVideos = async (newVideos: VideoItem[]) => {
    localStorage.setItem('videos', JSON.stringify(newVideos));
    setVideos(newVideos);
  };

  const handlePlayVideo = async (video: VideoItem) => {
    const updated = videos.map(v =>
      v.id === video.id ? { ...v, views: v.views + 1 } : v
    );
    saveVideos(updated);
    setSelectedVideo(video);
    
    // Update views in Supabase asynchronously
    if (video.id) {
      try {
        await videosAPI.update(video.id, { views: video.views + 1 });
      } catch (error) {
        console.error('Error updating video views:', error);
      }
    }
  };

  const filteredVideos = selectedSubject === 'all'
    ? videos
    : videos.filter(v => {
        const subject = v.subjectCode || v.category || '';
        return subject === selectedSubject;
      });

  const levels = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">رجوع</span>
              </button>
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Video className="w-8 h-8" />
                  🎥 فيديوهات EduFlow
                </h1>
                <p className="text-white/80 text-sm md:text-base">محتوى فيديو تعليمي احترافي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedVideo.type === 'uploaded' ? (
                  // Uploaded video file
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full h-full"
                    style={{ maxHeight: '100%' }}
                  />
                ) : (
                  // YouTube embed
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedVideo.titleAr}</h3>
                <p className="text-blue-200 mb-4">{selectedVideo.descriptionAr}</p>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Level Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedLevel(0)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedLevel === 0
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            الكل / All
          </button>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedLevel === level
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Level {level} / المستوى {level}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
              selectedSubject === 'all'
                ? 'bg-white text-blue-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <div>الكل</div>
            <div className="text-xs opacity-80">All</div>
          </button>
          {ALL_SUBJECTS
            .filter(s => selectedLevel === 0 || s.level === selectedLevel)
            .map(subject => (
            <button
              key={subject.code}
              onClick={() => setSelectedSubject(subject.code)}
              className={`flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                selectedSubject === subject.code
                  ? 'bg-white text-purple-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <div>{subject.code}</div>
              <div className="text-xs opacity-80">{subject.name}</div>
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all transform hover:scale-105"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-800 overflow-hidden group cursor-pointer" onClick={() => handlePlayVideo(video)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs font-semibold">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{video.titleAr}</h3>
                <p className="text-sm text-white/70 mb-2">{video.title}</p>
                <p className="text-xs text-white/60 mb-3 line-clamp-2">{video.descriptionAr}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-white/60 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views} مشاهدة</span>
                  </div>
                  <span>{new Date(video.uploadDate).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">لا توجد فيديوهات في هذا القسم</p>
            <p className="text-sm">No videos in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
