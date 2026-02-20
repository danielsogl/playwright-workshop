'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/react';

export default function ClockPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionStart] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Session timeout after 30 minutes (for testing)
  useEffect(() => {
    const sessionTimer = setTimeout(
      () => {
        // Simulate session timeout
        console.log('Session timeout reached');
      },
      30 * 60 * 1000,
    ); // 30 minutes

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Clock & Timer Testing Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Time Display */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Aktuelle Zeit</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center" aria-live="polite" role="timer">
              <div
                suppressHydrationWarning
                data-testid="current-time"
                className="text-4xl font-mono font-bold mb-2 tabular-nums"
              >
                {formatTime(currentTime)}
              </div>
              <div
                suppressHydrationWarning
                data-testid="current-date"
                className="text-lg text-default-500"
              >
                {formatDate(currentTime)}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Session Info</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Session Start: </span>
                <span
                  suppressHydrationWarning
                  data-testid="session-start"
                  className="tabular-nums"
                >
                  {formatTime(sessionStart)}
                </span>
              </div>
              <div>
                <span className="font-medium">Session Dauer: </span>
                <span
                  suppressHydrationWarning
                  data-testid="session-duration"
                  className="tabular-nums"
                >
                  {getSessionDuration()}
                </span>
              </div>
              <div>
                <span className="font-medium">Timeout in: </span>
                <span
                  suppressHydrationWarning
                  data-testid="session-timeout"
                  className="tabular-nums"
                >
                  {30 -
                    Math.floor(
                      (currentTime.getTime() - sessionStart.getTime()) /
                        (1000 * 60),
                    )}{' '}
                  Minuten
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Countdown Timer */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Countdown Timer</h2>
          </CardHeader>
          <CardBody>
            {countdown !== null ? (
              <div className="text-center">
                <div
                  data-testid="countdown-display"
                  className="text-3xl font-mono font-bold mb-4 tabular-nums"
                  aria-live="assertive"
                  role="timer"
                >
                  {formatCountdown(countdown)}
                </div>
                <Button
                  color="danger"
                  aria-label="Stop countdown timer"
                  onPress={() => setCountdown(null)}
                >
                  Stop
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  data-testid="start-1min-timer"
                  color="primary"
                  aria-label="Start 1 minute timer"
                  onPress={() => startCountdown(1)}
                >
                  1 Minute
                </Button>
                <Button
                  data-testid="start-5min-timer"
                  color="success"
                  aria-label="Start 5 minute timer"
                  onPress={() => startCountdown(5)}
                >
                  5 Minuten
                </Button>
                <Button
                  data-testid="start-10min-timer"
                  color="secondary"
                  aria-label="Start 10 minute timer"
                  onPress={() => startCountdown(10)}
                >
                  10 Minuten
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Last Updated */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Auto-Update Info</h2>
          </CardHeader>
          <CardBody>
            <div>
              <span className="font-medium">Zuletzt aktualisiert: </span>
              <span
                suppressHydrationWarning
                data-testid="last-updated"
                className="tabular-nums"
              >
                {formatTime(currentTime)}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-medium">Auto-Refresh: </span>
              <span className="text-success">Aktiv</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Special Date Messages */}
      {currentTime.getMonth() === 11 && currentTime.getDate() === 25 && (
        <Card className="mt-6 bg-danger-50">
          <CardBody>
            <div
              data-testid="christmas-message"
              className="text-center text-xl font-bold text-danger"
            >
              Frohe Weihnachten!
            </div>
          </CardBody>
        </Card>
      )}

      {currentTime.getMonth() === 11 && currentTime.getDate() === 31 && (
        <Card className="mt-6 bg-primary-50">
          <CardBody>
            <div
              data-testid="newyear-message"
              className="text-center text-xl font-bold text-primary"
            >
              Frohes neues Jahr!
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
