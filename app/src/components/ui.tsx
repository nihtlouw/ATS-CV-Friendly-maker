import { useId } from "react";
import type { ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
};

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  inputClassName,
  autoComplete = "off",
}: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={cn("field", inputClassName)}
        value={value}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
};

export function TextArea({ label, value, onChange, placeholder, rows = 4, className }: TextAreaProps) {
  const id = useId();
  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="field resize-y leading-relaxed"
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <span className="text-[12.5px] font-medium text-ink">{label}</span>
        {description && <p className="mt-0.5 text-[11px] leading-4 text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
          checked ? "border-forest bg-forest" : "border-line bg-paper-2",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-all",
            checked ? "left-[18px]" : "left-[2px]",
          )}
        />
      </button>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex w-full rounded-xl border border-line bg-paper-2/60 p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition",
            value === option.value
              ? "bg-cream text-ink shadow-sm ring-1 ring-line"
              : "text-muted hover:text-ink",
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ScoreRing({
  score,
  size = 64,
  stroke = 6,
  tone = "light",
}: {
  score: number;
  size?: number;
  stroke?: number;
  tone?: "light" | "dark";
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} out of 100 ATS readiness`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={tone === "dark" ? "rgba(255,255,255,0.16)" : "#E4DFD2"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={tone === "dark" ? "#DFECAB" : "#1B4B39"}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display font-medium tabular-nums",
          tone === "dark" ? "text-cream" : "text-ink",
        )}
        style={{ fontSize: size * 0.34 }}
      >
        {score}
      </span>
    </div>
  );
}

export function Accordion({
  number,
  title,
  meta,
  complete,
  open,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  meta: string;
  complete: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-line-soft last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-paper/40 sm:px-5"
      >
        <span className="font-mono text-[10px] tabular-nums text-[#a6afa5]">{number}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-ink">{title}</span>
            {complete && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-forest/10">
                <Check className="h-2.5 w-2.5 text-forest" strokeWidth={3} aria-label="Complete" />
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted">{meta}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#98a49a] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div className="accordion-body" data-open={open}>
        <div className="accordion-inner">
          <div className="px-4 pb-4 sm:px-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Chip({
  children,
  onRemove,
  onClick,
  variant = "default",
  title,
}: {
  children: ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: "default" | "matched" | "missing";
  title?: string;
}) {
  const styles = {
    default: "border-line bg-cream text-ink-soft hover:border-ink/20",
    matched: "border-forest/20 bg-forest/[0.07] text-forest",
    missing: "border-dashed border-[#cdc5b4] bg-cream/60 text-ink-soft hover:border-forest/40 hover:bg-lime-soft/60",
  };
  return (
    <span
      title={title}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-md border py-1 pl-2 pr-1.5 text-[11px] font-medium leading-4 transition",
        styles[variant],
      )}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className="max-w-full truncate text-left">
          {children}
        </button>
      ) : (
        <span className="max-w-full truncate">{children}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === "string" ? children : "item"}`}
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[#93a096] transition hover:bg-ink/10 hover:text-ink"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </span>
  );
}
