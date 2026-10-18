'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';

import { PageHeader } from '@/components/page-header';

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

  const timeoutMinutes =
    30 -
    Math.floor((currentTime.getTime() - sessionStart.getTime()) / (1000 * 60));

  const sessionProgress = Math.min(100, ((30 - timeoutMinutes) / 30) * 100);

  return (
    <div className="flex flex-col gap-8 pt-14 pb-24">
      <PageHeader
        id="clock-title"
        label="03 · page.clock"
        title="Clock & Timer"
        subtitle="Testing Page for time-based interactions"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Current Time Display */}
        <section
          aria-labelledby="current-time-title"
          className="flex flex-col gap-7 rounded-[20px] border border-terminal-border bg-terminal p-7 text-terminal-foreground"
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-[15px] font-semibold text-terminal-muted"
              id="current-time-title"
            >
              Aktuelle Zeit
            </h2>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-terminal-accent">
              <span
                className="size-2 rounded-full bg-terminal-accent"
                aria-hidden="true"
              />
              live
            </span>
          </div>
          <div className="flex flex-col gap-2" aria-live="polite" role="timer">
            <div
              suppressHydrationWarning
              data-testid="current-time"
              className="font-mono text-[56px] leading-none font-medium tracking-[-0.04em] text-terminal-accent tabular-nums lg:text-[88px]"
            >
              {formatTime(currentTime)}
            </div>
            <div
              suppressHydrationWarning
              data-testid="current-date"
              className="text-terminal-muted"
            >
              {formatDate(currentTime)}
            </div>
          </div>
        </section>

        {/* Session Info */}
        <section
          aria-labelledby="session-info-title"
          className="rounded-[20px] border border-border bg-surface p-7 flex flex-col gap-5"
        >
          <h2 className="text-[15px] font-semibold" id="session-info-title">
            Session Info
          </h2>
          <dl className="m-0 flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-separator py-3.5 last:border-b-0">
              <dt className="text-[15px] text-muted">Session Start</dt>
              <dd
                suppressHydrationWarning
                data-testid="session-start"
                className="font-mono font-medium tabular-nums"
              >
                {formatTime(sessionStart)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-separator py-3.5 last:border-b-0">
              <dt className="text-[15px] text-muted">Session Dauer</dt>
              <dd
                suppressHydrationWarning
                data-testid="session-duration"
                className="font-mono font-medium tabular-nums"
              >
                {getSessionDuration()}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-separator py-3.5 last:border-b-0">
              <dt className="text-[15px] text-muted">Timeout in</dt>
              <dd
                suppressHydrationWarning
                data-testid="session-timeout"
                className={`rounded-full px-2.5 py-1 font-mono text-sm font-medium ${
                  timeoutMinutes < 10
                    ? 'bg-warning-soft text-warning-soft-foreground'
                    : 'bg-success-soft text-success-soft-foreground'
                }`}
              >
                {timeoutMinutes} Min
              </dd>
            </div>
          </dl>
          <div
            aria-hidden="true"
            className="h-1.5 overflow-hidden rounded-full bg-default"
          >
            <div
              suppressHydrationWarning
              className="h-full bg-accent"
              style={{ width: `${sessionProgress}%` }}
            />
          </div>
        </section>

        {/* Countdown Timer */}
        <section
          aria-labelledby="countdown-title"
          className="rounded-[20px] border border-border bg-surface p-7 flex flex-col gap-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold" id="countdown-title">
              Countdown Timer
            </h2>
            {countdown !== null && (
              <span className="font-mono text-xs text-warning">running</span>
            )}
          </div>
          {countdown !== null ? (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div
                data-testid="countdown-display"
                className="font-mono text-[72px] leading-none font-medium tracking-[-0.04em] text-warning tabular-nums"
                aria-live="assertive"
                role="timer"
              >
                {formatCountdown(countdown)}
              </div>
              <Button
                className="min-h-11 rounded-full px-[18px] font-medium bg-danger-soft font-semibold text-danger-soft-foreground"
                aria-label="Stop countdown timer"
                onPress={() => setCountdown(null)}
              >
                Stop
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10].map((minutes) => (
                <Button
                  key={minutes}
                  data-testid={`start-${minutes}min-timer`}
                  className="min-h-11 rounded-full px-[18px] font-medium border border-field-border bg-surface text-foreground transition-colors hover:border-foreground hover:bg-hover"
                  aria-label={`Start ${minutes} minute timer`}
                  onPress={() => startCountdown(minutes)}
                >
                  {minutes} Min
                </Button>
              ))}
            </div>
          )}
        </section>

        {/* Last Updated */}
        <section
          aria-labelledby="auto-update-title"
          className="rounded-[20px] border border-border bg-surface p-7 flex flex-col gap-5"
        >
          <h2 className="text-[15px] font-semibold" id="auto-update-title">
            Auto-Update Info
          </h2>
          <dl className="m-0 flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-separator py-3.5 last:border-b-0">
              <dt className="text-[15px] text-muted">Zuletzt aktualisiert</dt>
              <dd
                suppressHydrationWarning
                data-testid="last-updated"
                className="font-mono font-medium tabular-nums"
              >
                {formatTime(currentTime)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-separator py-3.5 last:border-b-0">
              <dt className="text-[15px] text-muted">Auto-Refresh</dt>
              <dd className="rounded-full bg-success-soft px-2.5 py-1 text-sm font-medium text-success-soft-foreground">
                Aktiv
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Special Date Messages */}
      {currentTime.getMonth() === 11 && currentTime.getDate() === 25 && (
        <div
          data-testid="christmas-message"
          className="rounded-[20px] bg-danger-soft p-5 text-center font-display text-2xl font-bold text-danger-soft-foreground"
        >
          Frohe Weihnachten!
        </div>
      )}

      {currentTime.getMonth() === 11 && currentTime.getDate() === 31 && (
        <div
          data-testid="newyear-message"
          className="rounded-[20px] bg-accent-soft p-5 text-center font-display text-2xl font-bold text-accent-soft-foreground"
        >
          Frohes neues Jahr!
        </div>
      )}
    </div>
  );
}
