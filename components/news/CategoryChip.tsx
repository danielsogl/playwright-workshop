// Distinct per category; colors differ in lightness, not just hue.
const categoryClasses: Record<string, string> = {
  Technology: 'bg-success-soft text-success-soft-foreground',
  Business: 'bg-warning-soft text-warning-soft-foreground',
  'World News':
    'bg-[#e4e8f5] text-[#1e3a8a] dark:bg-[#1c2440] dark:text-[#a9bcf5]',
};

export function CategoryChip({ category }: { category: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        categoryClasses[category] ?? 'bg-default text-foreground'
      }`}
    >
      {category}
    </span>
  );
}
