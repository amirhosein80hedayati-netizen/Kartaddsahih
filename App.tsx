import { useState, useEffect } from 'react';
import LessonSection from './components/LessonSection';
import ChallengeSection from './components/ChallengeSection';
import GameSection from './components/GameSection';

type Tab = 'home' | 'lessons' | 'challenges' | 'games';

function FloatingNumbers() {
  const numbers = ['+۳', '-۵', '+۷', '-۲', '+۹', '-۴', '+۱', '-۸', '+۶', '-۱'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {numbers.map((num, i) => (
        <div
          key={i}
          className="absolute text-white/10 font-black select-none"
          style={{
            left: `${(i * 10) + 2}%`,
            top: `${(i * 8) + 5}%`,
            fontSize: `${20 + (i % 3) * 15}px`,
            animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
}

function HeroSection({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="relative bg-gradient-to-bl from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
      <FloatingNumbers />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <img
            src="/images/hero-math.jpg"
            alt="ریاضی"
            className="w-48 h-48 mx-auto rounded-3xl shadow-2xl object-cover border-4 border-white/20"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
          🔢 اعداد صحیح
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-2">ریاضی کلاس ششم ابتدایی</p>
        <p className="text-lg text-white/60 mb-10">با بازی و چالش، ریاضی رو یاد بگیر! 🎯</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('lessons')}
            className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
          >
            📚 شروع یادگیری
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-black text-lg hover:scale-105 transition-all hover:bg-white/30"
          >
            🧩 چالش‌ها
          </button>
          <button
            onClick={() => onNavigate('games')}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-black text-lg hover:scale-105 transition-all hover:bg-white/30"
          >
            🎮 بازی‌ها
          </button>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { num: '۵', label: 'درس آموزشی', emoji: '📖' },
            { num: '۲۰', label: 'سؤال چالشی', emoji: '🧩' },
            { num: '۳', label: 'بازی جذاب', emoji: '🎮' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-black">{stat.num}</div>
              <div className="text-xs text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Wave */}
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 80" fill="none">
        <path d="M0 40C480 80 960 0 1440 40V80H0V40Z" fill="#f8fafc" />
      </svg>
    </div>
  );
}

function Navbar({ activeTab, onNavigate }: { activeTab: Tab; onNavigate: (tab: Tab) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'home', label: 'خانه', emoji: '🏠' },
    { id: 'lessons', label: 'آموزش', emoji: '📚' },
    { id: 'challenges', label: 'چالش', emoji: '🧩' },
    { id: 'games', label: 'بازی', emoji: '🎮' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-white shadow-md'}`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <span className="font-black text-indigo-700 text-lg hidden sm:block">اعداد صحیح</span>
          </button>
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                <span className="ml-1">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-l from-indigo-900 to-purple-900 text-white py-12">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="text-4xl mb-4">🔢</div>
        <h3 className="text-xl font-black mb-2">اعداد صحیح - کلاس ششم</h3>
        <p className="text-white/60 mb-6">یادگیری ریاضی با بازی و چالش</p>
        <div className="flex justify-center gap-6 text-3xl mb-6">
          <span className="animate-bounce-slow" style={{ animationDelay: '0s' }}>➕</span>
          <span className="animate-bounce-slow" style={{ animationDelay: '0.2s' }}>➖</span>
          <span className="animate-bounce-slow" style={{ animationDelay: '0.4s' }}>✖️</span>
          <span className="animate-bounce-slow" style={{ animationDelay: '0.6s' }}>➗</span>
        </div>
        <p className="text-white/40 text-sm">ساخته شده با ❤️ برای دانش‌آموزان عزیز</p>
      </div>
    </footer>
  );
}

function QuickTips() {
  const tips = [
    { emoji: '💡', title: 'نکته ۱', text: 'هر عدد با قرینه‌اش جمع بشه، می‌شه صفر!' },
    { emoji: '🎯', title: 'نکته ۲', text: 'ضرب دو عدد هم‌علامت همیشه مثبت است!' },
    { emoji: '⚡', title: 'نکته ۳', text: 'تفریق = جمع با قرینه' },
    { emoji: '🌟', title: 'نکته ۴', text: 'قدر مطلق همیشه مثبت یا صفر است!' },
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-l from-amber-50 to-orange-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center text-amber-800 mb-8">💡 نکته‌های طلایی</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{tip.emoji}</div>
              <h4 className="font-bold text-amber-800 mb-1">{tip.title}</h4>
              <p className="text-gray-600 text-sm">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const handleNavigate = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
      <Navbar activeTab={activeTab} onNavigate={handleNavigate} />
      
      {activeTab === 'home' && (
        <>
          <HeroSection onNavigate={handleNavigate} />
          <QuickTips />
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-black text-indigo-900 mb-8">🚀 از کجا شروع کنم؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleNavigate('lessons')}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-right"
                >
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-xl font-black text-indigo-800 mb-2">اول یاد بگیر</h3>
                  <p className="text-gray-500 text-sm">۵ درس کامل با مثال‌های ساده و قابل فهم</p>
                  <div className="mt-4 text-indigo-500 font-bold text-sm">شروع آموزش ←</div>
                </button>
                <button
                  onClick={() => handleNavigate('challenges')}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-right"
                >
                  <div className="text-5xl mb-4">🧩</div>
                  <h3 className="text-xl font-black text-indigo-800 mb-2">بعد تست بزن</h3>
                  <p className="text-gray-500 text-sm">۲۰ سؤال چالشی در ۳ سطح مختلف</p>
                  <div className="mt-4 text-indigo-500 font-bold text-sm">شروع چالش ←</div>
                </button>
                <button
                  onClick={() => handleNavigate('games')}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-right"
                >
                  <div className="text-5xl mb-4">🎮</div>
                  <h3 className="text-xl font-black text-indigo-800 mb-2">در آخر بازی کن</h3>
                  <p className="text-gray-500 text-sm">۳ بازی جذاب برای تمرین و سرگرمی</p>
                  <div className="mt-4 text-indigo-500 font-bold text-sm">شروع بازی ←</div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'lessons' && <LessonSection />}
      {activeTab === 'challenges' && <ChallengeSection />}
      {activeTab === 'games' && <GameSection />}

      <Footer />
    </div>
  );
}
