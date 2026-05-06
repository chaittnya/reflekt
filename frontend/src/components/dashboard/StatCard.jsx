import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getScoreColor, getScoreLabel, getScoreCategory } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function StatCard({ title, score, subtitle, icon: Icon, delay = 0 }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const category = getScoreCategory(score);

  const badgeClass = {
    good: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </span>
        </div>
        <span
          className={cn(
            'text-xs font-semibold px-2.5 py-1 rounded-full',
            badgeClass
          )}
        >
          {label}
        </span>
      </div>

      {/* Score */}
      <div>
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
          className="text-4xl font-bold text-gray-900 dark:text-white"
          style={{ color }}
        >
          {score}
          <span className="text-lg text-gray-400 dark:text-gray-500 font-normal ml-1">
            /100
          </span>
        </motion.div>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}
