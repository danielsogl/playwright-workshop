'use client';

import { FC } from 'react';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useTheme } from 'next-themes';
import { useIsSSR } from '@react-aria/ssr';
import clsx from 'clsx';

import { SunFilledIcon, MoonFilledIcon } from '@/components/icons';

export interface ThemeSwitchProps {
  className?: string;
}

// HeroUI v3 removed the useSwitch hook; a theme toggle is just a button.
export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  const isLight = theme === 'light' || isSSR;

  return (
    <button
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={clsx(
        'px-px transition-opacity hover:opacity-80 cursor-pointer flex items-center justify-center text-muted',
        className,
      )}
      role="switch"
      aria-checked={isLight}
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      <VisuallyHidden>Toggle theme</VisuallyHidden>
      {isLight ? (
        <SunFilledIcon size={22} aria-hidden="true" />
      ) : (
        <MoonFilledIcon size={22} aria-hidden="true" />
      )}
    </button>
  );
};
