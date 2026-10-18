'use client';

import { FC } from 'react';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useTheme } from 'next-themes';
import { useIsSSR } from '@react-aria/ssr';

import { Moon, Sun } from 'lucide-react';

// HeroUI v3 removed the useSwitch hook; a theme toggle is just a button.
export const ThemeSwitch: FC = () => {
  // resolvedTheme: with defaultTheme 'system', theme is just 'system'.
  const { resolvedTheme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  const isLight = resolvedTheme === 'light' || isSSR;

  return (
    <button
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-hover"
      role="switch"
      aria-checked={isLight}
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      <VisuallyHidden>Toggle theme</VisuallyHidden>
      {/* Shows the mode you switch to, as in the design */}
      {isLight ? (
        <Moon className="size-[18px]" aria-hidden="true" />
      ) : (
        <Sun className="size-[18px]" aria-hidden="true" />
      )}
    </button>
  );
};
