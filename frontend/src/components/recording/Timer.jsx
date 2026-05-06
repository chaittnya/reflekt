import { motion } from 'framer-motion';
import { formatDuration } from '../../utils/formatters';
import { MAX_RECORDING_SECONDS } from '../../utils/constants';

export function Timer({ timeLeft, isRecording }) {
  const elapsed = MAX_RECORDING_SECONDS - timeLeft;
  const progress = elapsed / MAX_RECORDING_SECONDS;
  const circumference = 2 * Math.PI * 36; // r=36

  const color = timeLeft <= 10 ? '#EF4444' : timeLeft <= 20 ? '#F59E0B' : '#6C63FF';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Circular progress */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-white/5"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset: circumference * (1 - progress),
            }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>

        {/* Time text */}
        <div className="text-center">
          <motion.span
            className="text-lg font-bold tabular-nums"
            style={{ color }}
            animate={timeLeft <= 10 && isRecording ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {formatDuration(timeLeft)}
          </motion.span>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
            {isRecording ? 'remaining' : 'max'}
          </p>
        </div>
      </div>

      {isRecording && (
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          <span className="text-xs font-semibold text-danger uppercase tracking-wider">
            Recording
          </span>
        </motion.div>
      )}
    </div>
  );
}
