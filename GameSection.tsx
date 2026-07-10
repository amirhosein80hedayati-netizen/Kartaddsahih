import { useState, useEffect, useCallback, useRef } from 'react';

type GameType = 'numberJump' | 'mathRace' | 'memoryMatch' | null;

// ============ GAME 1: NUMBER JUMP ============
function NumberJumpGame({ onBack }: { onBack: () => void }) {
  const [target, setTarget] = useState(0);
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('');
  const [_history, setHistory] = useState<number[]>([0]);
  const [level, setLevel] = useState(1);

  const generateTarget = useCallback(() => {
    const range = 3 + level * 2;
    let t = 0;
    while (t === 0) {
      t = Math.floor(Math.random() * (range * 2 + 1)) - range;
    }
    return t;
  }, [level]);

  useEffect(() => {
    setTarget(generateTarget());
  }, [generateTarget]);

  const jump = (amount: number) => {
    const newPos = position + amount;
    if (newPos < -15 || newPos > 15) {
      setMessage('⚠️ نمی‌توانی از محور خارج شوی!');
      return;
    }
    setPosition(newPos);
    setMoves(m => m + 1);
    setHistory(h => [...h, newPos]);
    
    if (newPos === target) {
      setScore(s => s + Math.max(10 - moves, 1));
      setMessage('🎉 آفرین! رسیدی به هدف!');
      setTimeout(() => {
        setPosition(0);
        setHistory([0]);
        setMoves(0);
        setTarget(generateTarget());
        setMessage('');
        if (score > 0 && score % 30 === 0) {
          setLevel(l => Math.min(l + 1, 5));
        }
      }, 1500);
    } else {
      setMessage('');
    }
  };

  const displayNumbers = [];
  for (let i = -10; i <= 10; i++) displayNumbers.push(i);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold">← بازگشت</button>
        <div className="flex gap-4">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">⭐ {score}</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">سطح {level}</span>
        </div>
      </div>

      <h3 className="text-xl font-black text-center text-indigo-800 mb-2">🐸 پرش روی محور اعداد</h3>
      <p className="text-center text-gray-500 mb-4">با دکمه‌ها به عدد هدف برس!</p>

      <div className="bg-gradient-to-l from-red-50 via-blue-50 to-green-50 rounded-2xl p-4 mb-4 text-center">
        <span className="text-lg text-gray-600">هدف: </span>
        <span className="text-3xl font-black text-indigo-700">{target > 0 ? `+${target}` : target}</span>
        <span className="text-lg text-gray-400 mr-4"> | مکان فعلی: </span>
        <span className="text-3xl font-black text-purple-600">{position > 0 ? `+${position}` : position}</span>
      </div>

      {/* Number line visualization */}
      <div className="overflow-x-auto mb-6">
        <div className="flex items-center justify-center min-w-max py-4 px-2">
          {displayNumbers.map(n => (
            <div key={n} className="relative flex flex-col items-center mx-0.5">
              {position === n && (
                <div className="absolute -top-7 text-2xl animate-bounce-slow">🐸</div>
              )}
              {target === n && position !== n && (
                <div className="absolute -top-7 text-xl">🎯</div>
              )}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${n === position ? 'bg-purple-500 text-white scale-125 ring-4 ring-purple-200' :
                    n === target ? 'bg-yellow-400 text-gray-800 scale-110 ring-4 ring-yellow-200' :
                    n === 0 ? 'bg-blue-500 text-white' :
                    n > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }
                  transition-all duration-300
                `}
              >
                {n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jump buttons */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[-3, -2, -1, 1, 2, 3].map(n => (
          <button
            key={n}
            onClick={() => jump(n)}
            className={`
              py-3 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-md
              ${n > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}
            `}
          >
            {n > 0 ? `+${n}` : n}
          </button>
        ))}
      </div>

      {message && (
        <div className="text-center text-lg font-bold text-indigo-700 animate-slide-in bg-indigo-50 rounded-2xl p-3">
          {message}
        </div>
      )}

      <p className="text-center text-gray-400 text-sm mt-3">تعداد حرکت: {moves}</p>
    </div>
  );
}

// ============ GAME 2: MATH RACE ============
function MathRaceGame({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateProblem = useCallback(() => {
    const a = Math.floor(Math.random() * 19) - 9;
    const b = Math.floor(Math.random() * 19) - 9;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let answer: number;
    
    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else answer = a * b;

    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const wrong = answer + (Math.floor(Math.random() * 11) - 5);
      if (wrong !== answer) wrongAnswers.add(wrong);
    }

    const allOptions = [answer, ...wrongAnswers];
    allOptions.sort(() => Math.random() - 0.5);

    setProblem({ a, b, op, answer });
    setOptions(allOptions);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    generateProblem();
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [gameActive]);

  const handleAnswer = (ans: number) => {
    if (!gameActive) return;
    setTotalAnswered(t => t + 1);
    if (ans === problem.answer) {
      setScore(s => s + 10);
      setCorrectAnswers(c => c + 1);
      setFeedback('✅');
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('❌');
    }
    setTimeout(() => {
      generateProblem();
    }, 400);
  };

  const formatNum = (n: number) => n >= 0 ? `(+${n})` : `(${n})`;

  if (!gameActive && timeLeft === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100 text-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold mb-4 block">← بازگشت</button>
        <div className="text-6xl mb-4">⏱️</div>
        <h3 className="text-2xl font-black text-indigo-800 mb-4">وقت تمام شد!</h3>
        <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
          <div className="text-4xl font-black text-indigo-700 mb-2">{score} امتیاز</div>
          <p className="text-gray-500">{correctAnswers} جواب درست از {totalAnswered} سؤال</p>
        </div>
        <button onClick={startGame} className="py-3 px-8 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg">
          🔄 بازی دوباره
        </button>
      </div>
    );
  }

  if (!gameActive) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100 text-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold mb-4 block">← بازگشت</button>
        <div className="text-6xl mb-4">🏎️</div>
        <h3 className="text-2xl font-black text-indigo-800 mb-4">مسابقه ریاضی</h3>
        <p className="text-gray-500 mb-6">۶۰ ثانیه وقت داری! هر جواب درست ۱۰ امتیاز و هر غلط ۵- امتیاز!</p>
        <button onClick={startGame} className="py-4 px-10 bg-gradient-to-l from-green-500 to-emerald-600 text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-lg">
          🚀 شروع!
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold">← بازگشت</button>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
            ⏱️ {timeLeft}
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">⭐ {score}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      <div className="text-center mb-8 relative">
        <div className="text-4xl font-black text-gray-800 py-6">
          {formatNum(problem.a)} {problem.op} {formatNum(problem.b)} = ?
        </div>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl animate-slide-in">
            {feedback}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, idx) => (
          <button
            key={`${opt}-${idx}`}
            onClick={() => handleAnswer(opt)}
            className="py-4 bg-gradient-to-l from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl text-xl font-bold text-indigo-800 hover:scale-105 hover:border-indigo-400 transition-all duration-200"
          >
            {opt >= 0 ? `+${opt}` : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ GAME 3: MEMORY MATCH ============
interface Card {
  id: number;
  value: string;
  matchId: number;
  flipped: boolean;
  matched: boolean;
}

function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const totalPairs = 6;

  const initGame = useCallback(() => {
    const pairs = [
      { expr: '(+۳)+(+۲)', result: '+۵' },
      { expr: '(-۴)+(-۱)', result: '-۵' },
      { expr: '(+۶)+(-۳)', result: '+۳' },
      { expr: '(-۲)×(-۳)', result: '+۶' },
      { expr: '(+۴)×(-۲)', result: '-۸' },
      { expr: '|-۷|', result: '۷' },
    ];

    const cardPairs: Card[] = [];
    pairs.forEach((pair, idx) => {
      cardPairs.push({ id: idx * 2, value: pair.expr, matchId: idx, flipped: false, matched: false });
      cardPairs.push({ id: idx * 2 + 1, value: pair.result, matchId: idx, flipped: false, matched: false });
    });

    cardPairs.sort(() => Math.random() - 0.5);
    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped.map(fId => newCards.find(c => c.id === fId)!);
      
      if (first.matchId === second.matchId) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.matchId === first.matchId ? { ...c, matched: true } : c));
          setFlippedCards([]);
          setMatchedPairs(prev => {
            const newVal = prev + 1;
            if (newVal >= totalPairs) setGameWon(true);
            return newVal;
          });
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.matched ? c : { ...c, flipped: false }));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (gameWon) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100 text-center animate-slide-in">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold mb-4 block">← بازگشت</button>
        <div className="text-6xl mb-4">🎊</div>
        <h3 className="text-2xl font-black text-green-600 mb-4">تبریک! همه جفت‌ها رو پیدا کردی!</h3>
        <p className="text-gray-500 mb-6">تعداد حرکت: {moves}</p>
        <button onClick={initGame} className="py-3 px-8 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg">
          🔄 بازی دوباره
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold">← بازگشت</button>
        <div className="flex gap-3">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
            ✅ {matchedPairs}/{totalPairs}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
            🔄 {moves}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-black text-center text-indigo-800 mb-2">🧠 بازی حافظه</h3>
      <p className="text-center text-gray-500 mb-6">عبارت ریاضی و جواب درستش رو پیدا کن!</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square rounded-2xl flex items-center justify-center p-2 text-sm font-bold
              transition-all duration-300 shadow-md
              ${card.matched
                ? 'bg-green-100 border-2 border-green-400 text-green-700 scale-95'
                : card.flipped
                  ? 'bg-indigo-100 border-2 border-indigo-400 text-indigo-800 scale-105'
                  : 'bg-gradient-to-bl from-indigo-500 to-purple-600 text-white cursor-pointer hover:scale-105 hover:shadow-lg'
              }
            `}
          >
            {card.flipped || card.matched ? (
              <span className="text-center leading-tight">{card.value}</span>
            ) : (
              <span className="text-2xl">❓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN GAME SECTION ============
export default function GameSection() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  if (activeGame === 'numberJump') {
    return (
      <section id="games" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <NumberJumpGame onBack={() => setActiveGame(null)} />
        </div>
      </section>
    );
  }

  if (activeGame === 'mathRace') {
    return (
      <section id="games" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <MathRaceGame onBack={() => setActiveGame(null)} />
        </div>
      </section>
    );
  }

  if (activeGame === 'memoryMatch') {
    return (
      <section id="games" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <MemoryMatchGame onBack={() => setActiveGame(null)} />
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black text-indigo-900 mb-3">🎮 بازی‌ها</h2>
        <p className="text-gray-500 text-lg mb-10">با بازی کردن یاد بگیر! یکی رو انتخاب کن!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveGame('numberJump')}
            className="bg-gradient-to-bl from-green-400 to-teal-500 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
          >
            <div className="text-6xl mb-4 group-hover:animate-bounce-slow">🐸</div>
            <div className="text-2xl font-black mb-2">پرش روی محور</div>
            <div className="text-white/80 text-sm">با پرش‌های مثبت و منفی به هدف برس!</div>
          </button>

          <button
            onClick={() => setActiveGame('mathRace')}
            className="bg-gradient-to-bl from-orange-400 to-red-500 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
          >
            <div className="text-6xl mb-4 group-hover:animate-bounce-slow">🏎️</div>
            <div className="text-2xl font-black mb-2">مسابقه ریاضی</div>
            <div className="text-white/80 text-sm">در ۶۰ ثانیه هرچه بیشتر جواب بده!</div>
          </button>

          <button
            onClick={() => setActiveGame('memoryMatch')}
            className="bg-gradient-to-bl from-purple-400 to-pink-500 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
          >
            <div className="text-6xl mb-4 group-hover:animate-bounce-slow">🧠</div>
            <div className="text-2xl font-black mb-2">بازی حافظه</div>
            <div className="text-white/80 text-sm">جفت عبارت و جوابش رو پیدا کن!</div>
          </button>
        </div>
      </div>
    </section>
  );
}
