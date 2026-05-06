export const APP_NAME = 'MindTrack';
export const MAX_RECORDING_SECONDS = 60;
export const TOKEN_KEY = 'mindtrack_token';
export const USER_KEY = 'mindtrack_user';
export const THEME_KEY = 'mindtrack_theme';

export const RECORDING_STEPS = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  FOLLOWUP: 'followup',
  DONE: 'done',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Record', path: '/record', icon: 'Mic' },
  { label: 'Results', path: '/results', icon: 'BarChart2' },
];
