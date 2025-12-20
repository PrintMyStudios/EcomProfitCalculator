interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularGauge({ value, max = 100, size = 120, strokeWidth = 8 }: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const offset = circumference - (clampedValue / max) * circumference;

  const getColor = () => {
    if (value < 0) return 'stroke-red-500';
    if (value < 15) return 'stroke-red-400';
    if (value < 25) return 'stroke-amber-500';
    if (value < 40) return 'stroke-emerald-500';
    return 'stroke-emerald-400';
  };

  const getGlow = () => {
    if (value < 0) return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (value < 15) return 'drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]';
    if (value < 25) return 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className={`-rotate-90 transition-all duration-700 ${getGlow()}`} width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none transition-all duration-700 ease-out ${getColor()}`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={value < 0 ? circumference : offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease-out, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold tabular-nums ${value < 15 ? 'text-red-500' : value < 25 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {value.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">margin</span>
      </div>
    </div>
  );
}
