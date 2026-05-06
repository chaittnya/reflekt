import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatDate } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {formatDate(label)}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 dark:text-gray-400">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function StatsChart({ data }) {
  const [activeLines, setActiveLines] = useState({
    burnoutScore: true,
    sleepScore: true,
  });

  const toggleLine = (key) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="card p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            15-Day Trend
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your wellness scores over the last 15 days
          </p>
        </div>

        {/* Legend toggles */}
        <div className="flex items-center gap-3">
          {[
            { key: 'burnoutScore', label: 'Burnout', color: '#6C63FF' },
            { key: 'sleepScore', label: 'Sleep', color: '#22C55E' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleLine(key)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                activeLines[key]
                  ? 'opacity-100'
                  : 'opacity-40'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(108,99,255,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {activeLines.burnoutScore && (
            <Line
              type="monotone"
              dataKey="burnoutScore"
              name="Burnout"
              stroke="#6C63FF"
              strokeWidth={2.5}
              dot={{ fill: '#6C63FF', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6C63FF' }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          )}
          {activeLines.sleepScore && (
            <Line
              type="monotone"
              dataKey="sleepScore"
              name="Sleep"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ fill: '#22C55E', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#22C55E' }}
              animationDuration={1400}
              animationEasing="ease-out"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
