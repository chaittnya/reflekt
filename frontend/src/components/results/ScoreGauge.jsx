import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel, getScoreCategory } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

const categoryConfig = {
  good: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-100 dark:border-green-800/30',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    emoji: '😊',
  },
  moderate: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-100 dark:border-yellow-800/30',
    badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
    emoji: '😐',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-100 dark:border-red-800/30',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    emoji: '😟',
  },
};

export function ScoreGauge({ title, score, description, delay = 0 }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const category = getScoreCategory(score);
  const config = categoryConfig[category];

  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'card border p-6 flex flex-col items-center text-center space-y-4',
        config.bg,
        config.border
      )}
    >
      {/* SVG Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg
          className="-rotate-90 absolute inset-0 w-full h-full"
          viewBox="0 0 120 120"
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-white/5"
            strokeWidth="8"
          />
          {/* Progress */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="text-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            {score}
          </motion.span>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">/100</p>
        </div>
      </div>

      {/* Title & label */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold',
            config.badge
          )}
        >
          <span>{config.emoji}</span>
          {label}
        </span>
      </div>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
