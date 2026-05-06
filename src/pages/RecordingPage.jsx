import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Send,
  MessageSquare,
  CheckCircle2,
  Brain,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MicButton } from '../components/recording/MicButton';
import { WaveformVisualizer } from '../components/recording/WaveformVisualizer';
import { Timer } from '../components/recording/Timer';
import { AudioPlayback } from '../components/recording/AudioPlayback';
import { Button } from '../components/ui/Button';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useApp } from '../store/AppContext';
import { audioService } from '../services/audioService';
import { RECORDING_STEPS } from '../utils/constants';

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

// ── Step 1: Main recording ──────────────────────────────────────────────────
function RecordingStep({ onSubmit, isSubmitting }) {
  const recorder = useAudioRecorder();

  const handleMicClick = () => {
    if (recorder.isRecording) {
      recorder.stop();
    } else {
      recorder.start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Check-in
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Talk about your day — how you're feeling, your stress levels, and your sleep.
        </p>
      </div>

      {/* Timer */}
      <Timer timeLeft={recorder.timeLeft} isRecording={recorder.isRecording} />

      {/* Mic */}
      <MicButton
        isRecording={recorder.isRecording}
        onClick={handleMicClick}
        disabled={recorder.isStopped}
      />

      {/* Waveform */}
      <div className="w-full max-w-sm px-4">
        <WaveformVisualizer
          analyserNode={recorder.analyserNode}
          isRecording={recorder.isRecording}
        />
      </div>

      {/* Error */}
      {recorder.hasError && (
        <p className="text-sm text-danger text-center px-4">{recorder.error}</p>
      )}

      {/* Playback + submit */}
      {recorder.isStopped && recorder.audioURL && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-4 px-4"
        >
          <AudioPlayback audioURL={recorder.audioURL} onReset={recorder.reset} />
          <Button
            onClick={() => onSubmit(recorder.audioBlob)}
            isLoading={isSubmitting}
            className="w-full"
            id="submit-audio-btn"
            rightIcon={<Send className="w-4 h-4" />}
          >
            Submit & Analyze
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ── Step 2: Processing animation ───────────────────────────────────────────
function ProcessingStep() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative">
        {/* Spinning rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-t-primary-500 border-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        <div className="w-28 h-28 rounded-full gradient-subtle flex items-center justify-center">
          <Brain className="w-12 h-12 text-primary-500" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-white"
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing your day...
        </motion.h2>
        <p className="text-gray-500 dark:text-gray-400">
          Our AI is carefully listening to understand how you're feeling
        </p>
      </div>

      {/* Animated progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Waveform bars decoration */}
      <div className="flex items-center gap-1 h-12">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-primary-400"
            animate={{
              height: ['8px', `${12 + Math.random() * 24}px`, '8px'],
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Follow-up questions ─────────────────────────────────────────────
function FollowupStep({ questions, currentIndex, onAnswer, isSubmitting }) {
  const recorder = useAudioRecorder();
  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleMicClick = () => {
    if (recorder.isRecording) recorder.stop();
    else recorder.start();
  };

  const handleSubmit = () => {
    onAnswer(recorder.audioBlob, question.id);
    recorder.reset();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span className="font-medium text-primary-500">Follow-up Questions</span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm card p-6 space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed">
            {question.question}
          </p>
        </div>
      </motion.div>

      {/* Mini recorder */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <Timer timeLeft={recorder.timeLeft} isRecording={recorder.isRecording} />
        <MicButton
          isRecording={recorder.isRecording}
          onClick={handleMicClick}
          disabled={recorder.isStopped}
        />
        <WaveformVisualizer
          analyserNode={recorder.analyserNode}
          isRecording={recorder.isRecording}
        />

        {recorder.isStopped && recorder.audioURL && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3"
          >
            <AudioPlayback audioURL={recorder.audioURL} onReset={recorder.reset} />
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="w-full"
              id={`followup-submit-${currentIndex}`}
              rightIcon={
                isLast ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              }
            >
              {isLast ? 'Get My Results' : 'Next Question'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Main Recording Page ─────────────────────────────────────────────────────
export default function RecordingPage() {
  const navigate = useNavigate();
  const {
    recordingStep,
    followupQuestions,
    sessionId,
    currentQuestionIndex,
    setRecordingStep,
    setSession,
    nextQuestion,
    setAnalysisResult,
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainAudioSubmit = async (audioBlob) => {
    try {
      setIsSubmitting(true);
      setRecordingStep(RECORDING_STEPS.PROCESSING);

      const result = await audioService.uploadAudio(audioBlob);
      setSession(result);
      setRecordingStep(RECORDING_STEPS.FOLLOWUP);
    } catch (err) {
      console.error(err);
      setRecordingStep(RECORDING_STEPS.IDLE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowupSubmit = async (audioBlob, questionId) => {
    try {
      setIsSubmitting(true);
      await audioService.uploadFollowup({ sessionId, questionId, audioBlob });

      const isLast = currentQuestionIndex === followupQuestions.length - 1;

      if (isLast) {
        setRecordingStep(RECORDING_STEPS.PROCESSING);
        const analysis = await audioService.analyzeSession(sessionId);
        setAnalysisResult(analysis);
        navigate('/results');
      } else {
        nextQuestion(questionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = recordingStep;

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: RECORDING_STEPS.IDLE, label: '1. Record' },
            { key: RECORDING_STEPS.PROCESSING, label: '2. Analyze' },
            { key: RECORDING_STEPS.FOLLOWUP, label: '3. Follow-up' },
          ].map((step, i, arr) => {
            const isDone =
              (currentStep === RECORDING_STEPS.PROCESSING && step.key === RECORDING_STEPS.IDLE) ||
              (currentStep === RECORDING_STEPS.FOLLOWUP &&
                (step.key === RECORDING_STEPS.IDLE || step.key === RECORDING_STEPS.PROCESSING));
            const isActive = currentStep === step.key;

            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : isDone
                      ? 'bg-good/20 text-good'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3" />}
                  {step.label}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-6 h-px bg-gray-200 dark:bg-white/10" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {(currentStep === RECORDING_STEPS.IDLE ||
              currentStep === RECORDING_STEPS.RECORDING) && (
              <RecordingStep
                onSubmit={handleMainAudioSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {currentStep === RECORDING_STEPS.PROCESSING && <ProcessingStep />}

            {currentStep === RECORDING_STEPS.FOLLOWUP && (
              <FollowupStep
                questions={followupQuestions}
                currentIndex={currentQuestionIndex}
                onAnswer={handleFollowupSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
