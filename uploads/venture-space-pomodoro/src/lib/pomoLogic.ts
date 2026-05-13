import { useState, useEffect, useCallback, useRef } from 'react';

export type PomoMode = 'focus' | 'short' | 'long';

export const DURATIONS: Record<PomoMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 20 * 60,
};

export interface PomoStats {
  total: number;
  focusMin: number;
  days: Record<string, number>;
  acts: Record<string, number>;
}

const STORAGE_KEY = 'pomo_v4_react';

export function usePomoLogic() {
  const [mode, setMode] = useState<PomoMode>('focus');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [activity, setActivity] = useState('');
  const [stats, setStats] = useState<PomoStats>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { total: 0, focusMin: 0, days: {}, acts: {} };
    } catch {
      return { total: 0, focusMin: 0, days: {}, acts: {} };
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveStats = useCallback((newStats: PomoStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  }, []);

  const todayKey = () => new Date().toISOString().slice(0, 10);

  const playChime = useCallback(() => {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = 0.22;
      master.connect(ctx.destination);
      
      [523.25, 659.25, 783.99, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.32;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, t);
        gain2.gain.value = 0.08;
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(1, t + 0.04);
        gain.gain.setValueAtTime(1, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
        
        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(master);
        gain2.connect(master);
        
        osc.start(t);
        osc.stop(t + 2.2);
        osc2.start(t);
        osc2.stop(t + 2.2);
      });
    } catch (e) {
      console.error('Audio chime failed', e);
    }
  }, []);

  const record = useCallback(() => {
    const today = todayKey();
    const actName = activity.trim() || 'Sin nombre';
    const newStats: PomoStats = {
      ...stats,
      total: stats.total + 1,
      focusMin: stats.focusMin + 25,
      days: { ...stats.days, [today]: (stats.days[today] || 0) + 1 },
      acts: { ...stats.acts, [actName]: (stats.acts[actName] || 0) + 1 },
    };
    saveStats(newStats);
  }, [activity, stats, saveStats]);

  const switchMode = useCallback((newMode: PomoMode, forceReset = true) => {
    setMode(newMode);
    if (forceReset) {
      setTimeLeft(DURATIONS[newMode]);
      setIsRunning(false);
    }
  }, []);

  const phaseEnd = useCallback(() => {
    setIsRunning(false);
    playChime();
    
    if (mode === 'focus') {
      const nextCycle = cycle + 1;
      setCycle(nextCycle);
      record();
      
      if (nextCycle >= 4) {
        setCycle(0);
        switchMode('long');
      } else {
        switchMode('short');
      }
    } else {
      switchMode('focus');
    }
  }, [mode, cycle, record, switchMode, playChime]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      phaseEnd();
    }
  }, [timeLeft, isRunning, phaseEnd]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const skipPhase = () => {
    setIsRunning(false);
    const next = mode === 'focus' ? (cycle >= 3 ? 'long' : 'short') : 'focus';
    switchMode(next);
  };

  const clearStats = () => {
    const emptyStats = { total: 0, focusMin: 0, days: {}, acts: {} };
    saveStats(emptyStats);
  };

  return {
    mode,
    timeLeft,
    isRunning,
    cycle,
    activity,
    setActivity,
    stats,
    toggleTimer,
    resetTimer,
    skipPhase,
    switchMode,
    clearStats,
  };
}
