import { useState } from 'react';
import NumberLine from './NumberLine';

const lessons = [
  {
    id: 1,
    title: '🔢 اعداد صحیح چیست؟',
    content: `اعداد صحیح شامل اعداد مثبت، منفی و صفر هستند.
    
مثال‌ها:
• اعداد مثبت: ۱+، ۲+، ۳+، ۴+، ...
• اعداد منفی: ۱-، ۲-، ۳-، ۴-، ...
• صفر: نه مثبت است و نه منفی

در زندگی روزمره:
🌡️ دمای هوا: ۵- درجه یعنی ۵ درجه زیر صفر
🏔️ ارتفاع: ۲۰۰- متر یعنی ۲۰۰ متر زیر سطح دریا
💰 بدهی: ۱۰۰۰- تومان یعنی ۱۰۰۰ تومان بدهکاری`,
    example: {
      type: 'numberline' as const,
      description: 'روی محور اعداد، اعداد مثبت سمت راست صفر و اعداد منفی سمت چپ صفر قرار دارند.',
    },
  },
  {
    id: 2,
    title: '➕ جمع اعداد صحیح',
    content: `قوانین جمع اعداد صحیح:

۱. جمع دو عدد مثبت: دو عدد را جمع کن → جواب مثبت
   مثال: (۲+) + (۳+) = ۵+

۲. جمع دو عدد منفی: دو عدد را جمع کن → جواب منفی
   مثال: (۲-) + (۳-) = ۵-

۳. جمع یک مثبت و یک منفی: تفاضل بگیر → علامت عدد بزرگ‌تر
   مثال: (۵+) + (۳-) = ۲+
   مثال: (۲+) + (۷-) = ۵-`,
    example: {
      type: 'calculation' as const,
      description: 'مثال‌های بیشتر جمع',
      problems: [
        { q: '(+۴) + (+۳) = ?', a: '+۷', explanation: 'دو عدد مثبت → جمع کن → مثبت' },
        { q: '(-۵) + (-۲) = ?', a: '-۷', explanation: 'دو عدد منفی → جمع کن → منفی' },
        { q: '(+۸) + (-۳) = ?', a: '+۵', explanation: 'تفاضل ۸ و ۳ = ۵ → علامت ۸ مثبت' },
        { q: '(-۶) + (+۲) = ?', a: '-۴', explanation: 'تفاضل ۶ و ۲ = ۴ → علامت ۶ منفی' },
      ],
    },
  },
  {
    id: 3,
    title: '➖ تفریق اعداد صحیح',
    content: `قانون طلایی تفریق:

تفریق = جمع با قرینه

یعنی هر تفریقی را می‌توان به جمع تبدیل کرد:
a - b = a + (-b)

مثال‌ها:
• (۵+) - (۳+) = (۵+) + (۳-) = ۲+
• (۳+) - (۷+) = (۳+) + (۷-) = ۴-
• (۴-) - (۲-) = (۴-) + (۲+) = ۲-
• (۲+) - (۵-) = (۲+) + (۵+) = ۷+`,
    example: {
      type: 'calculation' as const,
      description: 'مثال‌های تفریق',
      problems: [
        { q: '(+۶) - (+۲) = ?', a: '+۴', explanation: '(+۶) + (-۲) = +۴' },
        { q: '(-۳) - (+۴) = ?', a: '-۷', explanation: '(-۳) + (-۴) = -۷' },
        { q: '(+۱) - (-۵) = ?', a: '+۶', explanation: '(+۱) + (+۵) = +۶' },
        { q: '(-۸) - (-۳) = ?', a: '-۵', explanation: '(-۸) + (+۳) = -۵' },
      ],
    },
  },
  {
    id: 4,
    title: '✖️ ضرب اعداد صحیح',
    content: `قوانین ضرب اعداد صحیح:

۱. مثبت × مثبت = مثبت ✅
   (+۳) × (+۴) = +۱۲

۲. منفی × منفی = مثبت ✅
   (-۳) × (-۴) = +۱۲

۳. مثبت × منفی = منفی ❌
   (+۳) × (-۴) = -۱۲

۴. منفی × مثبت = منفی ❌
   (-۳) × (+۴) = -۱۲

قانون ساده: هم‌علامت → مثبت، ناهم‌علامت → منفی`,
    example: {
      type: 'calculation' as const,
      description: 'مثال‌های ضرب',
      problems: [
        { q: '(+۵) × (+۳) = ?', a: '+۱۵', explanation: 'هم‌علامت → مثبت' },
        { q: '(-۴) × (-۶) = ?', a: '+۲۴', explanation: 'هم‌علامت → مثبت' },
        { q: '(+۷) × (-۲) = ?', a: '-۱۴', explanation: 'ناهم‌علامت → منفی' },
        { q: '(-۹) × (+۳) = ?', a: '-۲۷', explanation: 'ناهم‌علامت → منفی' },
      ],
    },
  },
  {
    id: 5,
    title: '📏 قدر مطلق',
    content: `قدر مطلق یک عدد = فاصله آن عدد تا صفر روی محور اعداد

علامت قدر مطلق: |a|

قوانین:
• قدر مطلق عدد مثبت = خود عدد: |+۵| = ۵
• قدر مطلق عدد منفی = بدون علامت منفی: |-۵| = ۵
• قدر مطلق صفر = صفر: |۰| = ۰

نکته مهم: قدر مطلق همیشه مثبت یا صفر است! 🎯`,
    example: {
      type: 'calculation' as const,
      description: 'مثال‌های قدر مطلق',
      problems: [
        { q: '|+۸| = ?', a: '۸', explanation: 'فاصله ۸+ تا صفر = ۸' },
        { q: '|-۶| = ?', a: '۶', explanation: 'فاصله ۶- تا صفر = ۶' },
        { q: '|۰| = ?', a: '۰', explanation: 'فاصله صفر تا صفر = ۰' },
        { q: '|-۱۲| = ?', a: '۱۲', explanation: 'فاصله ۱۲- تا صفر = ۱۲' },
      ],
    },
  },
];

export default function LessonSection() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswer = (key: string) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const lesson = lessons[activeLesson];

  return (
    <section id="lessons" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-3 text-indigo-900">
          📚 آموزش اعداد صحیح
        </h2>
        <p className="text-center text-gray-500 mb-10 text-lg">هر درس را انتخاب کن و یاد بگیر!</p>

        {/* Lesson tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {lessons.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => { setActiveLesson(idx); setRevealedAnswers({}); }}
              className={`
                px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md
                ${activeLesson === idx
                  ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white scale-105 shadow-indigo-300'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:shadow-lg border border-gray-200'
                }
              `}
            >
              {l.title}
            </button>
          ))}
        </div>

        {/* Lesson content */}
        <div className="animate-slide-in bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100" key={activeLesson}>
          <h3 className="text-2xl font-black text-indigo-800 mb-6">{lesson.title}</h3>
          
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
            <pre className="whitespace-pre-wrap text-gray-800 text-base leading-8 font-[Vazirmatn]">
              {lesson.content}
            </pre>
          </div>

          {/* Number line for first lesson */}
          {lesson.example.type === 'numberline' && (
            <div className="mb-8">
              <h4 className="text-lg font-bold text-indigo-700 mb-3">🎯 {lesson.example.description}</h4>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-indigo-200">
                <NumberLine min={-7} max={7} />
              </div>
            </div>
          )}

          {/* Calculation examples */}
          {lesson.example.type === 'calculation' && lesson.example.problems && (
            <div>
              <h4 className="text-lg font-bold text-indigo-700 mb-4">🎯 {lesson.example.description}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.example.problems.map((p, idx) => {
                  const key = `${activeLesson}-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-l from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-sm"
                    >
                      <p className="text-xl font-bold text-gray-800 mb-3 text-center">{p.q}</p>
                      <button
                        onClick={() => toggleAnswer(key)}
                        className="w-full py-2 px-4 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
                      >
                        {revealedAnswers[key] ? '🙈 پنهان کردن' : '👀 نمایش جواب'}
                      </button>
                      {revealedAnswers[key] && (
                        <div className="mt-3 animate-slide-in text-center">
                          <p className="text-2xl font-black text-green-600 mb-1">
                            جواب: {p.a}
                          </p>
                          <p className="text-sm text-gray-600">{p.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
