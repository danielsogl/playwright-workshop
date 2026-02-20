'use client';

import { useState, useEffect } from 'react';
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
            <div className="text-center">
              <div
                data-testid="current-time"
                className="text-4xl font-mono font-bold mb-2"
              >
                {formatTime(currentTime)}
              </div>
              <div data-testid="current-date" className="text-lg text-gray-600">
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
                <span data-testid="session-start">
                  {formatTime(sessionStart)}
                </span>
              </div>
              <div>
                <span className="font-medium">Session Dauer: </span>
                <span data-testid="session-duration">
                  {getSessionDuration()}
                </span>
              </div>
              <div>
                <span className="font-medium">Timeout in: </span>
                <span data-testid="session-timeout">
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
                  className="text-3xl font-mono font-bold mb-4"
                >
                  {formatCountdown(countdown)}
                </div>
                <button
                  onClick={() => setCountdown(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Stop
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  data-testid="start-1min-timer"
                  onClick={() => startCountdown(1)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  1 Minute
                </button>
                <button
                  data-testid="start-5min-timer"
                  onClick={() => startCountdown(5)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  5 Minuten
                </button>
                <button
                  data-testid="start-10min-timer"
                  onClick={() => startCountdown(10)}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  10 Minuten
                </button>
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
              <span data-testid="last-updated">{formatTime(currentTime)}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">Auto-Refresh: </span>
              <span className="text-green-500">Aktiv</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Special Date Messages */}
      {currentTime.getMonth() === 11 && currentTime.getDate() === 25 && (
        <Card className="mt-6 bg-red-50">
          <CardBody>
            <div
              data-testid="christmas-message"
              className="text-center text-xl font-bold text-red-600"
            >
              🎄 Frohe Weihnachten! 🎄
            </div>
          </CardBody>
        </Card>
      )}

      {currentTime.getMonth() === 11 && currentTime.getDate() === 31 && (
        <Card className="mt-6 bg-blue-50">
          <CardBody>
            <div
              data-testid="newyear-message"
              className="text-center text-xl font-bold text-blue-600"
            >
              🎊 Frohes neues Jahr! 🎊
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
