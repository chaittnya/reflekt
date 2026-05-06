import { useEffect, useRef } from 'react';

const BAR_COUNT = 40;
const BAR_WIDTH = 3;
const BAR_GAP = 2;

export function WaveformVisualizer({ analyserNode, isRecording, color = '#6C63FF' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!analyserNode || !isRecording) {
        // Draw flat idle bars
        const total = BAR_COUNT * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
        const startX = (width - total) / 2;
        for (let i = 0; i < BAR_COUNT; i++) {
          const x = startX + i * (BAR_WIDTH + BAR_GAP);
          const barH = 4;
          ctx.fillStyle = color + '40';
          ctx.beginPath();
          ctx.roundRect(x, height / 2 - barH / 2, BAR_WIDTH, barH, 2);
          ctx.fill();
        }
        return;
      }

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      const total = BAR_COUNT * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
      const startX = (width - total) / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength * 0.7);
        const value = dataArray[dataIndex] / 255;
        const barH = Math.max(4, value * height * 0.85);
        const x = startX + i * (BAR_WIDTH + BAR_GAP);
        const y = height / 2 - barH / 2;

        // Gradient color by height
        const alpha = 0.4 + value * 0.6;
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.roundRect(x, y, BAR_WIDTH, barH, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    if (isRecording && analyserNode) {
      animFrameRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyserNode, isRecording, color]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-20 rounded-xl"
      style={{ display: 'block' }}
    />
  );
}
