import api from './api';

const sleepToScore = (sleepHours) => {
  if (sleepHours == null) return 0;
  return Math.min(100, Math.round((sleepHours / 8) * 100));
};

export const statsService = {
  async getLast15Days() {
    const response = await api.get('/stats/?days=15');
    const entries = response.data.daily_entries || [];
    return entries.map((entry) => ({
      date: entry.date,
      burnoutScore: entry.burnout_score ?? 0,
      sleepScore: sleepToScore(entry.sleep_duration),
    }));
  },

  async getTodaySummary() {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await api.get('/journal/', { params: { date: today } });
      const entry = response.data;
      return {
        burnoutScore: entry.burnout_score ?? 0,
        sleepScore: sleepToScore(entry.sleep_duration),
        recordedAt: entry.created_at || entry.date,
        summary: entry.text,
      };
    } catch (error) {
      return null;
    }
  },

  async getResults() {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await api.get('/journal/', { params: { date: today } });
      const entry = response.data;
      return {
        burnoutScore: entry.burnout_score ?? 0,
        sleepScore: sleepToScore(entry.sleep_duration),
        summary: entry.text || entry.refined_text || 'No summary available.',
        recommendations: [],
      };
    } catch (error) {
      return null;
    }
  },
};
