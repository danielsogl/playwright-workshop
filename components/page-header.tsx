import { eyebrow, subtitle, title } from '@/components/primitives';

interface PageHeaderProps {
  id: string;
  label: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  id,
  label,
  title: heading,
  subtitle: description,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="flex flex-col gap-2.5">
        <p className={eyebrow()}>{label}</p>
        <h1 className={title()} id={id}>
          {heading}
        </h1>
        {description && <p className={subtitle()}>{description}</p>}
      </div>
      {children}
    </div>
  );
}
