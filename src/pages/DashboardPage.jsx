import { motion } from 'framer-motion';
import { Flame, Moon, Mic, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useStats } from '../hooks/useStats';
import { Navbar } from '../components/layout/Navbar';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatCard } from '../components/dashboard/StatCard';
import { StatsChart } from '../components/dashboard/StatsChart';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, todaySummary, isLoading, error, refetch } = useStats();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 space-y-8">
        {/* Welcome banner */}
        <WelcomeBanner user={user} hasTodaySummary={!!todaySummary} />

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center justify-between gap-4"
          >
            <p className="text-sm text-danger">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 text-sm font-medium text-danger hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </motion.div>
        )}

        {/* Today's summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Today's Snapshot</h2>
            {todaySummary && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Last updated:{' '}
                {new Date(todaySummary.recordedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : todaySummary ? (
              <>
                <StatCard
                  title="Burnout Score"
                  score={todaySummary.burnoutScore}
                  subtitle="Higher score = higher burnout risk"
                  icon={Flame}
                  delay={0}
                />
                <StatCard
                  title="Sleep Health"
                  score={todaySummary.sleepScore}
                  subtitle="Higher score = better sleep quality"
                  icon={Moon}
                  delay={0.1}
                />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full card p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl gradient-subtle flex items-center justify-center mx-auto">
                  <Mic className="w-8 h-8 text-primary-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    No check-in today
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Record your daily audio journal to get your wellness scores.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/record')}
                  id="start-recording-btn"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Today's Check-in
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* 15-day chart */}
        <div>
          <h2 className="section-title mb-4">Wellness Trends</h2>
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <StatsChart data={stats} />
          )}
        </div>

        {/* Quick action */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="gradient-primary rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white"
          >
            <div>
              <h3 className="text-lg font-bold">Ready for today's check-in?</h3>
              <p className="text-primary-100 text-sm">
                Takes just 60 seconds. Talk about your day.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/record')}
              className="bg-white/20 hover:bg-white/30 text-white border-0 flex-shrink-0"
              id="quick-record-btn"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Record Now
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
