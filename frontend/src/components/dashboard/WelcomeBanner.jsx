import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function WelcomeBanner({ user, hasTodaySummary }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl gradient-primary p-6 md:p-8 text-white"
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium text-primary-100">{greeting}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {user?.name ? `Hey, ${user.name.split(' ')[0]}! 👋` : 'Welcome back! 👋'}
        </h1>
        <p className="text-primary-100 text-sm md:text-base max-w-lg">
          {hasTodaySummary
            ? "Here's your mental wellness snapshot for today."
            : "You haven't recorded your daily check-in yet. How are you feeling?"}
        </p>
      </div>
    </motion.div>
  );
}
