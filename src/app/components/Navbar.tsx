import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Bell, LogOut } from 'lucide-react';
import type { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
}

export function Navbar({ currentPage, onNavigate, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { name: 'الرئيسية', nameEn: 'Home', page: 'landing' as Page },
    { name: 'الامتحانات', nameEn: 'Exams', page: 'exams' as Page },
    { name: 'الملخصات', nameEn: 'Summaries', page: 'summaries' as Page },
    { name: 'الفيديوهات', nameEn: 'Videos', page: 'videos' as Page },
    { name: 'اللايفات', nameEn: 'Live', page: 'lives' as Page },
  ];

  const isAdmin = currentPage === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Clean and Professional */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('landing')}>
            {/* Logo Icon */}
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <div className="relative font-black text-xl text-white">
                ✎
              </div>
            </div>
            
            {/* Logo Text */}
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black text-slate-900">
                EduFlow
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                منصة تعليمية
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-3.5 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                  currentPage === item.page
                      ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {!isAdmin && (
              <button className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}



            {isAdmin && (
              <button
                onClick={onLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === item.page
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن دورة أو امتحان... / Search..."
                className="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-500 transition-all duration-300 font-medium"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
