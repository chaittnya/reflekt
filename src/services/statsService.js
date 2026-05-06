import { mockDelay } from './api';

// Generate 15 days of realistic mock stats
const generateStatsData = () => {
  const data = [];
  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      burnoutScore: Math.round(20 + Math.random() * 60),
      sleepScore: Math.round(30 + Math.random() * 65),
    });
  }
  return data;
};

const MOCK_STATS = generateStatsData();

const MOCK_TODAY_SUMMARY = {
  burnoutScore: 42,
  sleepScore: 71,
  mood: 'Moderate',
  recordedAt: new Date().toISOString(),
};

export const statsService = {
  async getLast15Days() {
    await mockDelay(900);
    return MOCK_STATS;
  },

  async getTodaySummary() {
    await mockDelay(600);
    return MOCK_TODAY_SUMMARY;
  },

  async getResults() {
    await mockDelay(800);
    return MOCK_TODAY_SUMMARY;
  },
};
