import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

export function MicButton({ isRecording, onClick, disabled = false }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                key="ring1"
                className="absolute w-32 h-32 rounded-full bg-primary-500/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                key="ring2"
                className="absolute w-32 h-32 rounded-full bg-primary-500/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              />
              <motion.div
                key="ring3"
                className="absolute w-32 h-32 rounded-full bg-danger/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          id="mic-record-btn"
          onClick={onClick}
          disabled={disabled}
          className={`
            relative z-10 w-24 h-24 rounded-full flex items-center justify-center
            shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30
            ${isRecording
              ? 'bg-danger hover:bg-red-600'
              : 'gradient-primary hover:opacity-90'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          animate={isRecording ? { scale: [1, 1.04, 1] } : {}}
          transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-white fill-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </motion.button>
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
      </p>
    </div>
  );
}
