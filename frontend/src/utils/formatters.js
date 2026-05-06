// Color and label helpers for scores
export const SCORE_THRESHOLDS = {
  good: 33,
  moderate: 66,
};

export const getScoreCategory = (score) => {
  if (score <= SCORE_THRESHOLDS.good) return 'good';
  if (score <= SCORE_THRESHOLDS.moderate) return 'moderate';
  return 'danger';
};

export const getScoreColor = (score) => {
  const cat = getScoreCategory(score);
  if (cat === 'good') return '#22C55E';
  if (cat === 'moderate') return '#F59E0B';
  return '#EF4444';
};

export const getScoreLabel = (score) => {
  const cat = getScoreCategory(score);
  if (cat === 'good') return 'Healthy';
  if (cat === 'moderate') return 'Moderate';
  return 'High Risk';
};

export const getScoreTailwindColor = (score) => {
  const cat = getScoreCategory(score);
  if (cat === 'good') return 'text-good';
  if (cat === 'moderate') return 'text-moderate';
  return 'text-danger';
};

export const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
