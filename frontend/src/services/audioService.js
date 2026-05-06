import api from './api';

export const audioService = {
  async uploadAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', new File([audioBlob], 'journal.wav', { type: 'audio/wav' }), 'journal.wav');

    const response = await api.post('/journal/', formData);
    const result = response.data;
    return {
      burnoutScore: result.burnout_score ?? 0,
      sleepScore: result.sleep_duration ? Math.round((result.sleep_duration / 8) * 100) : 0,
      summary: result.refined_text || result.raw_text || 'Journal entry saved.',
      recommendations: [],
      date: result.date,
    };
  },
};
