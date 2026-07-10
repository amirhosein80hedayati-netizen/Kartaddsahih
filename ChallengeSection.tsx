import { useState, useCallback } from 'react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const allQuestions: Question[] = [
  { question: '(+۵) + (-۳) = ?', options: ['+۸', '+۲', '-۲', '-۸'], correct: 1, explanation: 'تفاضل ۵ و ۳ = ۲ → علامت ۵ مثبت → +۲' },
  { question: '(-۷) + (-۴) = ?', options: ['+۱۱', '-۱۱', '+۳', '-۳'], correct: 1, explanation: 'دو عدد منفی → جمع → منفی: -۱۱' },
  { question: '(+۶) - (+۹) = ?', options: ['+۳', '-۳', '+۱۵', '-۱۵'], correct: 1, explanation: '(+۶) + (-۹) = -۳' },
  { question: '(-۴) × (-۵) = ?', options: ['-۲۰', '+۲۰', '-۹', '+۹'], correct: 1, explanation: 'هم‌علامت → مثبت: +۲۰' },
  { question: '|−۹| = ?', options: ['-۹', '۹', '۰', '-۱'], correct: 1, explanation: 'فاصله ۹- تا صفر = ۹' },
  { question: '(+۳) × (-۷) = ?', options: ['+۲۱', '-۲۱', '+۱۰', '-۱۰'], correct: 1, explanation: 'ناهم‌علامت → منفی: -۲۱' },
  { question: '(-۸) + (+۸) = ?', options: ['+۱۶', '-۱۶', '۰', '+۸'], correct: 2, explanation: 'عدد و قرینه‌اش → صفر' },
  { question: 'قرینه عدد ۶- چیست؟', options: ['-۶', '+۶', '۰', '-۱۲'], correct: 1, explanation: 'قرینه ۶- = ۶+' },
  { question: '(-۲) × (-۳) × (-۱) = ?', options: ['+۶', '-۶', '+۵', '-۵'], correct: 1, explanation: '(-۲)×(-۳)=+۶ → (+۶)×(-۱)=-۶' },
  { question: '(+۱۰) - (-۵) = ?', options: ['+۵', '-۵', '+۱۵', '-۱۵'], correct: 2, explanation: '(+۱۰) + (+۵) = +۱۵' },
  { question: '|-۱۵| + |+۵| = ?', options: ['۱۰', '۲۰', '-۱۰', '-۲۰'], correct: 1, explanation: '۱۵ + ۵ = ۲۰' },
  { question: 'کدام عدد از همه کوچک‌تر است؟', options: ['-۱۰', '-۳', '+۲', '۰'], correct: 0, explanation: '-۱۰ از همه کوچک‌تر است' },
  { question: '(+۴) + (-۴) + (+۷) = ?', options: ['+۷', '-۷', '+۱۵', '۰'], correct: 0, explanation: '(+۴)+(-۴)=۰ → ۰+(+۷)=+۷' },
  { question: '(-۳) × (+۲) × (-۱) = ?', options: ['-۶', '+۶', '-۵', '+۵'], correct: 1, explanation: '(-۳)×(+۲)=-۶ → (-۶)×(-۱)=+۶' },
  { question: 'کدام گزینه درست است؟', options: ['-۵ > -۳', '-۳ > -۵', '-۵ > ۰', '-۳ < -۵'], correct: 1, explanation: '-۳ به صفر نزدیک‌تر → بزرگ‌تر' },
  { question: '(+۲۰) ÷ (-۴) = ?', options: ['+۵', '-۵', '+۲۴', '-۲۴'], correct: 1, explanation: 'ناهم‌علامت → منفی: -۵' },
  { question: '(-۱۸) ÷ (-۶) = ?', options: ['-۳', '+۳', '-۱۲', '+۱۲'], correct: 1, explanation: 'هم‌علامت → مثبت: +۳' },
  { question: '(-۱) × (-۱) × (-۱) × (-۱) = ?', options: ['-۱', '+۱', '۰', '-۴'], correct: 1, explanation: 'تعداد زوج منفی → مثبت: +۱' },
  { question: '|+۳ - (+۸)| = ?', options: ['۵', '-۵', '۱۱', '-۱۱'], correct: 0, explanation: '+۳ - (+۸) = -۵ → |-۵| = ۵' },
  { question: 'اگر a = -۳ باشد، ۲a + ۱ = ?', options: ['-۵', '+۵', '-۷', '+۷'], correct: 0, explanation: '۲×(-۳)+۱ = -۶+۱ = -۵' },
];

const QUESTIONS_PER_ROUND = 8;

type Difficulty = 'easy' | 'medium' | 'hard';

export default function ChallengeSection() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const startChallenge = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const start = diff === 'easy' ? 0 : diff === 'medium' ? 4 : 8;
    const pool = shuffled.slice(start, start + QUESTIONS_PER_ROUND);
    if (pool.length < QUESTIONS_PER_ROUND) {
      const extra = shuffled.slice(0, QUESTIONS_PER_ROUND - pool.length);
      pool.push(...extra);
    }
    setQuestions(pool.slice(0, QUESTIONS_PER_ROUND));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setStarted(true);
    setStreak(0);
    setBestStreak(0);
  }, []);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[currentQ].correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const getGrade = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return { emoji: '🏆', text: 'عالی! تو یک نابغه‌ای!', color: 'text-yellow-500' };
    if (pct >= 75) return { emoji: '🌟', text: 'آفرین! خیلی خوب بود!', color: 'text-green-500' };
    if (pct >= 50) return { emoji: '👍', text: 'خوب بود! بیشتر تمرین کن!', color: 'text-blue-500' };
    return { emoji: '💪', text: 'ناامید نشو! دوباره تلاش کن!', color: 'text-orange-500' };
  };

  if (!started) {
    return (
      <section id="challenges" className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-indigo-900 mb-3">🧩 چالش و آزمون</h2>
          <p className="text-gray-500 text-lg mb-10">سطح خودت را انتخاب کن و شروع کن!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { diff: 'easy' as Difficulty, label: 'آسان', emoji: '🟢', desc: 'برای شروع عالیه', color: 'from-green-400 to-emerald-500' },
              { diff: 'medium' as Difficulty, label: 'متوسط', emoji: '🟡', desc: 'یکم فکر می‌خواد', color: 'from-yellow-400 to-orange-500' },
              { diff: 'hard' as Difficulty, label: 'سخت', emoji: '🔴', desc: 'فقط حرفه‌ای‌ها!', color: 'from-red-400 to-pink-500' },
            ].map(({ diff, label, emoji, desc, color }) => (
              <button
                key={diff}
                onClick={() => startChallenge(diff)}
                className={`
                  bg-gradient-to-bl ${color} text-white rounded-3xl p-8 shadow-xl
                  hover:scale-105 transition-all duration-300 hover:shadow-2xl
                `}
              >
                <div className="text-5xl mb-4">{emoji}</div>
                <div className="text-2xl font-black mb-2">{label}</div>
                <div className="text-white/80">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const grade = getGrade();
    return (
      <section id="challenges" className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center animate-slide-in">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100">
            <div className="text-7xl mb-6">{grade.emoji}</div>
            <h3 className={`text-3xl font-black mb-4 ${grade.color}`}>{grade.text}</h3>
            
            <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-black text-indigo-800 mb-2">
                {score} / {questions.length}
              </div>
              <p className="text-gray-500">امتیاز شما</p>
              {bestStreak > 1 && (
                <p className="text-orange-500 font-bold mt-2">🔥 بهترین رکورد پشت سر هم: {bestStreak}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => startChallenge(difficulty)}
                className="py-3 px-8 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
              >
                🔄 تلاش دوباره
              </button>
              <button
                onClick={() => setStarted(false)}
                className="py-3 px-8 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                ← بازگشت
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const q = questions[currentQ];

  return (
    <section id="challenges" className="py-16 px-4">
      <div className="max-w-2xl mx-auto animate-slide-in" key={currentQ}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-gray-400">
              سؤال {currentQ + 1} از {questions.length}
            </span>
            <div className="flex items-center gap-4">
              {streak > 0 && (
                <span className="text-orange-500 font-bold text-sm">🔥 {streak}</span>
              )}
              <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-sm">
                امتیاز: {score}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h3 className="text-2xl font-black text-gray-800 text-center mb-8">{q.question}</h3>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {q.options.map((opt, idx) => {
              let btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-800 hover:bg-indigo-50 hover:border-indigo-300';
              if (showResult) {
                if (idx === q.correct) {
                  btnClass = 'bg-green-100 border-2 border-green-500 text-green-800';
                } else if (idx === selected && idx !== q.correct) {
                  btnClass = 'bg-red-100 border-2 border-red-500 text-red-800';
                } else {
                  btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`
                    ${btnClass} rounded-2xl p-4 text-xl font-bold transition-all duration-300
                    ${!showResult ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                >
                  {showResult && idx === q.correct && '✅ '}
                  {showResult && idx === selected && idx !== q.correct && '❌ '}
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="animate-slide-in">
              <div className={`p-4 rounded-2xl mb-4 ${selected === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-bold text-gray-700">
                  {selected === q.correct ? '🎉 آفرین! جواب درسته!' : '😔 اشتباه بود!'}
                </p>
                <p className="text-gray-600 text-sm mt-1">💡 {q.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-lg"
              >
                {currentQ + 1 >= questions.length ? '🏁 نتیجه نهایی' : '⬅️ سؤال بعدی'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
