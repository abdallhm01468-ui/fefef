import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleSecretClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-admin-trigger]')) {
      onAdminClick?.();
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white">
                ✎
              </div>
              <div>
                <h3 className="font-bold text-slate-900">EduFlow</h3>
                <p className="text-xs text-slate-600">منصة تعليمية ذكية</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              منصة تعليمية متطورة توفر امتحانات ذكية، فيديوهات عالية الجودة، وملخصات احترافية
            </p>
            <div className="flex gap-3">
              <button className="p-2 bg-slate-100 hover:bg-blue-100 rounded-lg transition-all text-slate-700 hover:text-blue-600">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-blue-100 rounded-lg transition-all text-slate-700 hover:text-blue-600">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-pink-100 rounded-lg transition-all text-slate-700 hover:text-pink-600">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-blue-100 rounded-lg transition-all text-slate-700 hover:text-blue-600">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">الامتحانات</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">الملخصات</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">الفيديوهات</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">الجلسات المباشرة</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">الجدول الدراسي</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-4">الدعم</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">support@eduflow.io</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">الرياض، السعودية</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-4">البريد الإلكتروني</h4>
            <p className="text-sm text-slate-600 mb-4">اشترك للحصول على آخر التحديثات والعروض الحصرية</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all">
                اشترك
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" onClick={handleSecretClick}>
          <p className="text-sm text-slate-600">
            © {currentYear} EduFlow. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">سياسة الخصوصية</a>
            <span className="text-slate-400">|</span>
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">شروط الخدمة</a>
            <span className="text-slate-400">|</span>
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">اتصل بنا</a>
          </div>

          <button
            data-admin-trigger
            onClick={(e) => {
              e.preventDefault();
              onAdminClick?.();
            }}
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-semibold"
            title="Admin Access"
          >
            💻 Developed by Abdullah Tamer, Mahmoud Hasham, Yosef Ahmed
          </button>
        </div>
      </div>
    </footer>
  );
}
