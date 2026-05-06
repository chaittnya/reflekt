import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Moon, ArrowLeft, RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { ScoreGauge } from '../components/results/ScoreGauge';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useApp } from '../store/AppContext';
import { statsService } from '../services/statsService';

const burnoutDescriptions = {
  good: 'Your burnout levels are healthy. Keep maintaining balance in your daily routine.',
  moderate: 'Moderate burnout detected. Consider taking more breaks and practicing mindfulness.',
  danger: 'High burnout risk! Please prioritize rest, set boundaries, and seek support if needed.',
};

const sleepDescriptions = {
  good: 'Excellent sleep quality! Your rest patterns are supporting your mental health.',
  moderate: 'Your sleep could be improved. Aim for 7-8 hours with a consistent schedule.',
  danger: 'Poor sleep quality is affecting your wellbeing. Consider a bedtime routine.',
};

export default function ResultsPage() {
  const { analysisResult, resetRecording } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(analysisResult);

  useEffect(() => {
    if (!results) {
      // Load from API if no in-memory result
      setIsLoading(true);
      statsService
        .getResults()
        .then(setResults)
        .finally(() => setIsLoading(false));
    }
  }, [results]);

  const getBurnoutCategory = (score) => {
    if (score <= 33) return 'good';
    if (score <= 66) return 'moderate';
    return 'danger';
  };

  const handleNewRecording = () => {
    resetRecording();
    navigate('/record');
  };

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Wellness Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Based on today's audio check-in, here's an overview of your mental health.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : results ? (
          <>
            {/* Score gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ScoreGauge
                title="Burnout Score"
                score={results.burnoutScore}
                description={burnoutDescriptions[getBurnoutCategory(results.burnoutScore)]}
                delay={0}
              />
              <ScoreGauge
                title="Sleep Health Score"
                score={results.sleepScore}
                description={sleepDescriptions[getBurnoutCategory(results.sleepScore)]}
                delay={0.15}
              />
            </div>

            {/* Summary */}
            {results.summary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6 space-y-3"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary-500" />
                  Analysis Summary
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {results.summary}
                </p>
              </motion.div>
            )}

            {/* Recommendations */}
            {results.recommendations?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-moderate" />
                  Personalized Recommendations
                </h2>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {rec}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                id="go-dashboard-btn"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={handleNewRecording}
                id="new-recording-btn"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                New Check-in
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-500 dark:text-gray-400">No results available.</p>
            <Button onClick={handleNewRecording} id="start-checkin-btn">
              Start a Check-in
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
