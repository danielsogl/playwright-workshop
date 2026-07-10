'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Chip } from '@heroui/react';
import { Clock, Timer, Activity, RefreshCw } from 'lucide-react';

export default function ClockPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionStart] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sessionTimer = setTimeout(
      () => {
        console.log('Session timeout reached');
      },
      30 * 60 * 1000,
    );

    return () => clearTimeout(sessionTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSessionDuration = () => {
    const diff = Math.floor(
      (currentTime.getTime() - sessionStart.getTime()) / 1000,
    );
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startCountdown = (minutes: number) => {
    const endTime = new Date(Date.now() + minutes * 60 * 1000);
    const timer = setInterval(() => {
      const remaining = Math.floor((endTime.getTime() - Date.now()) / 1000);
      if (remaining <= 0) {
        setCountdown(null);
        clearInterval(timer);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeoutMinutes = 30 -
    Math.floor(
      (currentTime.getTime() - sessionStart.getTime()) / (1000 * 60),
    );

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Clock & Timer</h1>
        <p className="text-muted">Testing Page for time-based interactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Time Display */}
        <Card className="border border-border bg-gradient-to-br from-accent/10 to-accent/10 dark:from-accent/20 dark:to-accent/20">
          <Card.Content className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Aktuelle Zeit</h2>
            </div>
            <div className="text-center py-4" aria-live="polite" role="timer">
              <div
                suppressHydrationWarning
                data-testid="current-time"
                className="text-5xl font-mono font-bold mb-3 tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent"
              >
                {formatTime(currentTime)}
              </div>
              <div
                suppressHydrationWarning
                data-testid="current-date"
                className="text-muted"
              >
                {formatDate(currentTime)}
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Session Info */}
        <Card className="border border-border">
          <Card.Content className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Session Info</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-default-soft rounded-lg">
                <span className="text-sm text-muted">Session Start</span>
                <span
                  suppressHydrationWarning
                  data-testid="session-start"
                  className="tabular-nums font-mono font-medium"
                >
                  {formatTime(sessionStart)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-default-soft rounded-lg">
                <span className="text-sm text-muted">Session Dauer</span>
                <span
                  suppressHydrationWarning
                  data-testid="session-duration"
                  className="tabular-nums font-mono font-medium"
                >
                  {getSessionDuration()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-default-soft rounded-lg">
                <span className="text-sm text-muted">Timeout in</span>
                <Chip
                  suppressHydrationWarning
                  data-testid="session-timeout"
                  color={timeoutMinutes < 10 ? 'warning' : 'success'}
                  variant="soft"
                  size="sm"
                >
                  {timeoutMinutes} Min
                </Chip>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Countdown Timer */}
        <Card className="border border-border">
          <Card.Content className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-5 h-5 text-warning" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Countdown Timer</h2>
            </div>
            {countdown !== null ? (
              <div className="text-center py-6">
                <div
                  data-testid="countdown-display"
                  className="text-5xl font-mono font-bold mb-6 tabular-nums text-warning"
                  aria-live="assertive"
                  role="timer"
                >
                  {formatCountdown(countdown)}
                </div>
                <Button
                  variant="danger"
                  size="lg"
                  aria-label="Stop countdown timer"
                  onPress={() => setCountdown(null)}
                >
                  Stop
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center py-4">
                <Button
                  data-testid="start-1min-timer"
                  variant="primary"
                  size="lg"
                  aria-label="Start 1 minute timer"
                  onPress={() => startCountdown(1)}
                >
                  1 Min
                </Button>
                <Button
                  data-testid="start-5min-timer"
                  variant="primary"
                  size="lg"
                  aria-label="Start 5 minute timer"
                  onPress={() => startCountdown(5)}
                >
                  5 Min
                </Button>
                <Button
                  data-testid="start-10min-timer"
                  variant="secondary"
                  size="lg"
                  aria-label="Start 10 minute timer"
                  onPress={() => startCountdown(10)}
                >
                  10 Min
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Last Updated */}
        <Card className="border border-border">
          <Card.Content className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-success" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Auto-Update Info</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-default-soft rounded-lg">
                <span className="text-sm text-muted">Zuletzt aktualisiert</span>
                <span
                  suppressHydrationWarning
                  data-testid="last-updated"
                  className="tabular-nums font-mono font-medium"
                >
                  {formatTime(currentTime)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-default-soft rounded-lg">
                <span className="text-sm text-muted">Auto-Refresh</span>
                <Chip color="success" variant="soft" size="sm">
                  Aktiv
                </Chip>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Special Date Messages */}
      {currentTime.getMonth() === 11 && currentTime.getDate() === 25 && (
        <Card className="border border-danger bg-danger/10">
          <Card.Content className="p-4">
            <div
              data-testid="christmas-message"
              className="text-center text-xl font-bold text-danger"
            >
              Frohe Weihnachten!
            </div>
          </Card.Content>
        </Card>
      )}

      {currentTime.getMonth() === 11 && currentTime.getDate() === 31 && (
        <Card className="border border-accent bg-accent/10">
          <Card.Content className="p-4">
            <div
              data-testid="newyear-message"
              className="text-center text-xl font-bold text-accent"
            >
              Frohes neues Jahr!
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
