'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, Clock, RotateCcw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimerResult {
  totalMinutes: number;
  itemsCompleted: number;
  minutesPerItem: number;
}

interface TimerProps {
  onComplete?: (result: TimerResult) => void;
  onAddToProduct?: (result: TimerResult) => void;
  className?: string;
  compact?: boolean;
  sessionKey?: string; // For localStorage persistence
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedDuration: number;
  elapsedMs: number;
  itemsCompleted: number;
}

const STORAGE_PREFIX = 'timer-session-';

function getStoredSession(key: string): TimerState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Recalculate elapsed time if timer was running
      if (parsed.isRunning && !parsed.isPaused && parsed.startTime) {
        parsed.elapsedMs = Date.now() - parsed.startTime + parsed.pausedDuration;
      }
      return parsed;
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

function storeSession(key: string, state: TimerState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(state));
  } catch {
    // Ignore localStorage errors
  }
}

function clearSession(key: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore localStorage errors
  }
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatTimeShort(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

const initialState: TimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pausedDuration: 0,
  elapsedMs: 0,
  itemsCompleted: 1,
};

export function Timer({
  onComplete,
  onAddToProduct,
  className,
  compact = false,
  sessionKey = 'default',
}: TimerProps) {
  const [timer, setTimer] = useState<TimerState>(() => {
    const stored = getStoredSession(sessionKey);
    return stored || initialState;
  });

  // Update elapsed time every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer.isRunning && !timer.isPaused && timer.startTime) {
      interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          elapsedMs: Date.now() - prev.startTime! + prev.pausedDuration,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.isPaused, timer.startTime]);

  // Persist to localStorage when state changes
  useEffect(() => {
    if (timer.isRunning || timer.elapsedMs > 0) {
      storeSession(sessionKey, timer);
    }
  }, [timer, sessionKey]);

  const startTimer = useCallback(() => {
    const now = Date.now();
    setTimer((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: prev.startTime || now,
      elapsedMs: prev.pausedDuration,
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isPaused: true,
      pausedDuration: prev.elapsedMs,
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isPaused: false,
      startTime: Date.now() - prev.elapsedMs,
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimer(initialState);
    clearSession(sessionKey);
  }, [sessionKey]);

  const handleAddToProduct = useCallback(() => {
    if (timer.elapsedMs === 0 || timer.itemsCompleted < 1) return;

    const totalMinutes = timer.elapsedMs / 1000 / 60;
    const minutesPerItem = totalMinutes / timer.itemsCompleted;

    const result: TimerResult = {
      totalMinutes,
      itemsCompleted: timer.itemsCompleted,
      minutesPerItem,
    };

    onAddToProduct?.(result);
    onComplete?.(result);
    resetTimer();
  }, [timer.elapsedMs, timer.itemsCompleted, onAddToProduct, onComplete, resetTimer]);

  const setItemsCompleted = useCallback((items: number) => {
    setTimer((prev) => ({
      ...prev,
      itemsCompleted: Math.max(1, items),
    }));
  }, []);

  const timePerItem = timer.itemsCompleted > 0 ? timer.elapsedMs / timer.itemsCompleted : 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="font-mono text-lg font-bold tabular-nums">
          {formatTime(timer.elapsedMs)}
        </div>
        <div className="flex items-center gap-1">
          {!timer.isRunning ? (
            <Button onClick={startTimer} size="icon" variant="outline" className="h-8 w-8">
              <Play className="h-3 w-3" />
            </Button>
          ) : timer.isPaused ? (
            <Button onClick={resumeTimer} size="icon" variant="outline" className="h-8 w-8">
              <Play className="h-3 w-3" />
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="icon" variant="outline" className="h-8 w-8">
              <Pause className="h-3 w-3" />
            </Button>
          )}
          {timer.elapsedMs > 0 && (
            <Button onClick={resetTimer} size="icon" variant="ghost" className="h-8 w-8">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Time Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold tabular-nums text-primary">
            {formatTime(timer.elapsedMs)}
          </div>
          {timer.elapsedMs > 0 && timer.itemsCompleted > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              Per item: {formatTimeShort(timePerItem)}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!timer.isRunning ? (
            <Button onClick={startTimer} size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Start
            </Button>
          ) : timer.isPaused ? (
            <Button onClick={resumeTimer} size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="sm" variant="outline" className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}

          <Button
            onClick={stopTimer}
            size="sm"
            variant="outline"
            disabled={!timer.isRunning}
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>

          {timer.elapsedMs > 0 && (
            <Button onClick={resetTimer} size="sm" variant="ghost" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Items Completed */}
        <div className="flex items-center justify-center gap-3">
          <Label htmlFor="items-completed" className="text-sm whitespace-nowrap">
            Items completed:
          </Label>
          <Input
            id="items-completed"
            type="number"
            min="1"
            value={timer.itemsCompleted}
            onChange={(e) => setItemsCompleted(parseInt(e.target.value) || 1)}
            className="w-20 text-center"
          />
        </div>

        {/* Add to Product Button */}
        {onAddToProduct && timer.elapsedMs > 0 && (
          <Button
            onClick={handleAddToProduct}
            className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Add to Product ({formatTimeShort(timePerItem)} per item)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
