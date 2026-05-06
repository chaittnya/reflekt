import { mockDelay } from './api';

const MOCK_FOLLOWUP_QUESTIONS = [
  {
    id: 'q1',
    question: 'You mentioned feeling stressed about work. Can you tell me more about what specifically is causing that stress?',
  },
  {
    id: 'q2',
    question: 'How has your sleep quality been recently? Are you having trouble falling asleep or staying asleep?',
  },
  {
    id: 'q3',
    question: 'What coping strategies have you tried, and how effective have they been for you?',
  },
];

const MOCK_ANALYSIS_RESULT = {
  burnoutScore: 58,
  sleepScore: 64,
  summary:
    'Your responses indicate moderate burnout levels, primarily driven by work-related stress. Your sleep patterns show room for improvement. Consider establishing a consistent wind-down routine.',
  recommendations: [
    'Try a 10-minute mindfulness session before bed',
    'Limit screen time 1 hour before sleep',
    'Take short breaks every 90 minutes during work',
  ],
};

export const audioService = {
  async uploadAudio(audioBlob) {
    await mockDelay(2500); // Simulate processing time

    // Return follow-up questions
    return {
      sessionId: `session_${Date.now()}`,
      questions: MOCK_FOLLOWUP_QUESTIONS.slice(0, 2 + Math.floor(Math.random() * 2)),
    };
  },

  async uploadFollowup({ sessionId, questionId, audioBlob }) {
    await mockDelay(1000);
    return { questionId, status: 'received' };
  },

  async analyzeSession(sessionId) {
    await mockDelay(3000); // Longer analysis time
    return MOCK_ANALYSIS_RESULT;
  },
};
