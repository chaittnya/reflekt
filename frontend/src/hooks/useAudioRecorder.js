import { useState, useRef, useCallback, useEffect } from 'react';
import { MAX_RECORDING_SECONDS } from '../utils/constants';

const RECORDING_STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  STOPPED: 'stopped',
  ERROR: 'error',
};

export function useAudioRecorder() {
  const [recordingState, setRecordingState] = useState(RECORDING_STATES.IDLE);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_RECORDING_SECONDS);
  const [error, setError] = useState(null);
  const [analyserNode, setAnalyserNode] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up Web Audio API for waveform
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;
      setAnalyserNode(analyser);

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        setDuration(MAX_RECORDING_SECONDS - timeLeft);
        cleanup();
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();
      setRecordingState(RECORDING_STATES.RECORDING);
      setTimeLeft(MAX_RECORDING_SECONDS);

      // Countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      setRecordingState(RECORDING_STATES.ERROR);
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordingState(RECORDING_STATES.STOPPED);
    setAnalyserNode(null);
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setRecordingState(RECORDING_STATES.IDLE);
    setAudioBlob(null);
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setDuration(0);
    setTimeLeft(MAX_RECORDING_SECONDS);
    setError(null);
    setAnalyserNode(null);
    chunksRef.current = [];
  }, [cleanup, audioURL]);

  return {
    recordingState,
    isIdle: recordingState === RECORDING_STATES.IDLE,
    isRecording: recordingState === RECORDING_STATES.RECORDING,
    isStopped: recordingState === RECORDING_STATES.STOPPED,
    hasError: recordingState === RECORDING_STATES.ERROR,
    audioBlob,
    audioURL,
    duration,
    timeLeft,
    error,
    analyserNode,
    start,
    stop,
    reset,
  };
}
