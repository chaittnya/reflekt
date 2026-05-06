import { createContext, useContext, useReducer, useEffect } from 'react';
import { THEME_KEY, RECORDING_STEPS } from '../utils/constants';

const AppContext = createContext(null);

const initialState = {
  darkMode: false,
  recordingStep: RECORDING_STEPS.IDLE,
  sessionId: null,
  followupQuestions: [],
  analysisResult: null,
  currentQuestionIndex: 0,
  completedFollowups: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_RECORDING_STEP':
      return { ...state, recordingStep: action.payload };
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        followupQuestions: action.payload.questions,
        currentQuestionIndex: 0,
        completedFollowups: [],
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        completedFollowups: [
          ...state.completedFollowups,
          action.payload, // questionId completed
        ],
      };
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload };
    case 'RESET_RECORDING':
      return {
        ...state,
        recordingStep: RECORDING_STEPS.IDLE,
        sessionId: null,
        followupQuestions: [],
        analysisResult: null,
        currentQuestionIndex: 0,
        completedFollowups: [],
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') {
      dispatch({ type: 'SET_DARK_MODE', payload: true });
    } else if (
      !saved &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      dispatch({ type: 'SET_DARK_MODE', payload: true });
    }
  }, []);

  // Sync dark mode to DOM + localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (state.darkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [state.darkMode]);

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });

  const setRecordingStep = (step) =>
    dispatch({ type: 'SET_RECORDING_STEP', payload: step });

  const setSession = (sessionData) =>
    dispatch({ type: 'SET_SESSION', payload: sessionData });

  const nextQuestion = (questionId) =>
    dispatch({ type: 'NEXT_QUESTION', payload: questionId });

  const setAnalysisResult = (result) =>
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result });

  const resetRecording = () => dispatch({ type: 'RESET_RECORDING' });

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleDarkMode,
        setRecordingStep,
        setSession,
        nextQuestion,
        setAnalysisResult,
        resetRecording,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
