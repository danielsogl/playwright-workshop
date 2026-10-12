import { tv } from 'tailwind-variants';

export const title = tv({
  base: 'font-display font-extrabold tracking-[-0.03em] text-foreground',
  variants: {
    size: {
      sm: 'text-3xl lg:text-4xl font-bold tracking-[-0.02em] leading-tight',
      md: 'text-4xl lg:text-[52px] leading-[1.02]',
      lg: 'text-[44px] sm:text-6xl lg:text-[76px] leading-[0.98] tracking-[-0.035em]',
    },
    fullWidth: {
      true: 'w-full block',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const subtitle = tv({
  base: 'text-lg text-muted max-w-2xl',
});

// Small monospace label above headings, e.g. "04 · waitForEvent('download')"
export const eyebrow = tv({
  base: 'font-mono text-[13px] text-muted',
});
