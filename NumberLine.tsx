

interface NumberLineProps {
  min?: number;
  max?: number;
  highlighted?: number[];
  showLabels?: boolean;
  interactive?: boolean;
  onNumberClick?: (n: number) => void;
  markerPosition?: number | null;
}

export default function NumberLine({
  min = -10,
  max = 10,
  highlighted = [],
  showLabels = true,
  interactive = false,
  onNumberClick,
  markerPosition = null,
}: NumberLineProps) {
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  const getColor = (n: number) => {
    if (highlighted.includes(n)) return 'bg-yellow-400 text-gray-900 scale-125 ring-4 ring-yellow-200';
    if (n > 0) return 'bg-green-500 text-white';
    if (n < 0) return 'bg-red-500 text-white';
    return 'bg-blue-600 text-white ring-2 ring-blue-300';
  };

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex items-center justify-center min-w-max px-4">
        {/* Arrow left */}
        <div className="text-2xl text-gray-400 ml-1">◄</div>
        
        <div className="relative flex items-center">
          {/* Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-300 via-blue-300 to-green-300 -translate-y-1/2 rounded-full" />
          
          {numbers.map((n) => (
            <div
              key={n}
              className="relative flex flex-col items-center mx-1"
            >
              {/* Tick mark */}
              <div className="w-0.5 h-4 bg-gray-400 mb-1" />
              
              {/* Number circle */}
              <button
                onClick={() => interactive && onNumberClick?.(n)}
                className={`
                  number-line-marker relative z-10 w-9 h-9 rounded-full flex items-center justify-center
                  text-sm font-bold shadow-md transition-all duration-300
                  ${getColor(n)}
                  ${interactive ? 'cursor-pointer hover:scale-130 hover:shadow-lg' : 'cursor-default'}
                  ${markerPosition === n ? 'animate-pulse-glow scale-130' : ''}
                `}
              >
                {showLabels ? n : ''}
              </button>
              
              {markerPosition === n && (
                <div className="absolute -top-8 text-2xl animate-bounce-slow">📍</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Arrow right */}
        <div className="text-2xl text-gray-400 mr-1">►</div>
      </div>
    </div>
  );
}
