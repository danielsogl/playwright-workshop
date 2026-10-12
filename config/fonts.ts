import {
  Bricolage_Grotesque as FontDisplay,
  Geist as FontSans,
  Geist_Mono as FontMono,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontDisplay = FontDisplay({
  subsets: ['latin'],
  variable: '--font-display',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
