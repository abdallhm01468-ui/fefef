import { BookOpen, Video, FileText, Radio, GraduationCap, TrendingUp, Users } from 'lucide-react';
import type { Page } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'امتحانات تفاعلية',
      description: 'اختبارات شاملة مع نتائج فورية وتحليل أداء',
      color: 'from-blue-500 to-cyan-600',
      page: 'exams' as Page,
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'ملخصات دراسية',
      description: 'ملخصات احترافية وملفات PDF قابلة للتحميل',
      color: 'from-green-500 to-emerald-600',
      page: 'summaries' as Page,
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'فيديوهات تعليمية',
      description: 'شروحات مفصلة بجودة عالية من خبرائك',
      color: 'from-purple-500 to-pink-600',
      page: 'videos' as Page,
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: 'جلسات مباشرة',
      description: 'محاضرات حية وتفاعل مباشر مع المحاضرين',
      color: 'from-red-500 to-orange-600',
      page: 'lives' as Page,
    },
  ];

  const stats = [
    { icon: <GraduationCap className="w-6 h-6" />, number: '500+', label: 'طالب' },
    { icon: <BookOpen className="w-6 h-6" />, number: '50+', label: 'امتحان' },
    { icon: <TrendingUp className="w-6 h-6" />, number: '95%', label: 'نسبة النجاح' },
    { icon: <Users className="w-6 h-6" />, number: '24/7', label: 'دعم' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-right md:text-right">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight">
                EduFlow
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  منصتك التعليمية
                </span>
              </h1>
              
              <div className="space-y-4 md:space-y-5 mb-8 md:mb-10">
                <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium">
                  منصة تعليمية ذكية تجمع الامتحانات، الفيديوهات، والملخصات
                </p>
                <p className="text-base sm:text-lg text-blue-200/90">
                  تعلم بذكاء • حلل أدائك • تفوق في دراستك
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end md:justify-start">
                <button
                  onClick={() => onNavigate('exams')}
                  className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 text-base md:text-lg whitespace-nowrap order-2 sm:order-1"
                >
                  🚀 ابدأ الآن
                </button>
                <button
                  onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 md:px-10 py-3 md:py-4 bg-white/10 backdrop-blur text-white border-2 border-blue-300 hover:bg-white/20 rounded-xl font-bold transition-all duration-300 active:scale-95 text-base md:text-lg whitespace-nowrap order-1 sm:order-2"
                >
                  اكتشف المزيد
                </button>
              </div>

              <div className="flex items-center gap-6 md:gap-8 pt-8 md:pt-10 border-t border-blue-400/30 justify-end md:justify-start flex-wrap">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-300">500+</div>
                  <div className="text-sm text-blue-200/80">طالب نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300">4.9★</div>
                  <div className="text-sm text-blue-200/80">تقييم ممتاز</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-300">95%</div>
                  <div className="text-sm text-blue-200/80">معدل النجاح</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-3xl blur-3xl opacity-25"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300">
                      <div className="text-3xl md:text-4xl mb-2">📚</div>
                      <div className="font-bold text-sm md:text-base">50+ امتحان</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300">
                      <div className="text-3xl md:text-4xl mb-2">📝</div>
                      <div className="font-bold text-sm md:text-base">ملخصات احترافية</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300">
                      <div className="text-3xl md:text-4xl mb-2">🎥</div>
                      <div className="font-bold text-sm md:text-base">فيديوهات HD</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300">
                      <div className="text-3xl md:text-4xl mb-2">🔴</div>
                      <div className="font-bold text-sm md:text-base">جلسات مباشرة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32 bg-slate-800 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              لماذا اختيار EduFlow؟
            </h2>
            <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
              منصة متكاملة لكل احتياجاتك التعليمية - امتحانات ذكية، فيديوهات جودة عالية، وملخصات احترافية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => onNavigate(feature.page)}
                className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 hover:shadow-2xl transition-all active:scale-95 border border-blue-400/30 hover:border-blue-400 text-left"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-200/80 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-blue-300 font-bold group-hover:translate-x-1 transition-transform">
                  <span>ابدأ الآن</span>
                  <span>←</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">إحصائيات من الطلاب الفعليين</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-6 bg-white/10 rounded-2xl backdrop-blur hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-base md:text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-slate-900 border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 md:mb-8">
            🚀 انضم إلى مجتمع EduFlow التعليمي
          </h2>
          <p className="text-lg md:text-xl text-blue-200 mb-8 md:mb-10">
            تعلم بكفاءة، حقق نتائج أفضل، تفوق في دراستك
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-10 md:px-12 py-3 md:py-5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 text-base md:text-xl"
          >
            ابدأ مجاناً الآن
          </button>
        </div>
      </section>
    </div>
  );
}
