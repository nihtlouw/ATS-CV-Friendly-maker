import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Download,
  FileDown,
  FilePlus2,
  FileText,
  MoreHorizontal,
  Printer,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/utils/cn";

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[11.5px] transition",
        danger ? "text-[#9c4b31] hover:bg-[#f8e9e2]" : "text-ink-soft hover:bg-paper-2/70",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", danger ? "text-[#a75c40]" : "text-[#849086]")} />
      {label}
    </button>
  );
}

export function Header({
  resumeName,
  title,
  score,
  saveState,
  onCopy,
  onPrint,
  onDownloadTxt,
  onUseSample,
  onStartBlank,
}: {
  resumeName: string;
  title: string;
  score: number;
  saveState: "saved" | "saving";
  onCopy: () => void;
  onPrint: () => void;
  onDownloadTxt: () => void;
  onUseSample: () => void;
  onStartBlank: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const run = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1640px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Plainly home">
          <span className="relative grid h-8 w-8 place-items-center rounded-[9px] bg-forest shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_3px_8px_-2px_rgba(27,75,57,0.45)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 3.5h8.5L19 8v12.5H6z"
                stroke="#F7F4EC"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M14 3.5V8h5" stroke="#F7F4EC" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9.5 12.5h6M9.5 16h4" stroke="#DFECAB" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-paper bg-lime" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[21px] font-semibold tracking-[-0.02em] text-ink">
              Plainly<span className="text-clay">.</span>
            </span>
            <span className="mt-[3px] block font-mono text-[7px] uppercase tracking-[0.24em] text-muted">
              ATS CV studio
            </span>
          </span>
        </a>

        <div className="mx-1 hidden h-7 w-px bg-line lg:block" />

        <div className="hidden min-w-0 items-center gap-2 rounded-lg border border-line bg-cream/60 px-2.5 py-1.5 lg:flex">
          <FileText className="h-3.5 w-3.5 shrink-0 text-[#8d998f]" />
          <span className="max-w-[150px] truncate text-[11px] font-medium text-ink">
            {resumeName.trim() || "Untitled CV"}
          </span>
          <span className="text-[10px] text-[#b0b7ae]">·</span>
          <span className="max-w-[210px] truncate text-[10.5px] text-muted lg:max-w-[260px]">
            {title.trim() || "Target role"}
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-forest/15 bg-forest/[0.055] py-1 pl-2 pr-2.5 sm:flex">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-forest/25 bg-cream">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  score >= 90 ? "bg-forest" : score >= 70 ? "bg-[#c09a4e]" : "bg-clay",
                )}
              />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-forest">
              ATS
            </span>
            <span className="font-mono text-[10px] font-medium tabular-nums text-forest">
              {score}
              <span className="text-forest/45">/100</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onCopy}
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11.5px] font-medium text-ink-soft transition hover:bg-cream hover:text-ink xl:flex"
          >
            <Copy className="h-3.5 w-3.5 text-[#819085]" />
            Copy text
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-2 text-[11.5px] font-semibold text-cream shadow-sm transition hover:bg-forest-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:px-3.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="More options"
              aria-expanded={menuOpen}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:border-ink/20 hover:bg-cream hover:text-ink",
                menuOpen && "border-ink/20 bg-cream text-ink",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="animate-fade-up absolute right-0 top-full z-50 mt-2 w-[228px] rounded-xl border border-line bg-cream p-1.5 shadow-[0_18px_40px_-12px_rgba(27,42,35,0.35)]">
                <p className="px-2.5 pb-1 pt-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#9aa49b]">
                  Export
                </p>
                <MenuItem icon={Copy} label="Copy as plain text" onClick={() => run(onCopy)} />
                <MenuItem icon={Download} label="Download PDF" onClick={() => run(onPrint)} />
                <MenuItem icon={FileDown} label="Download .txt" onClick={() => run(onDownloadTxt)} />
                <div className="my-1 h-px bg-line-soft" />
                <p className="px-2.5 pb-1 pt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#9aa49b]">
                  Document
                </p>
                <MenuItem icon={Printer} label="Print preview" onClick={() => run(onPrint)} />
                <MenuItem icon={RotateCcw} label="Restore sample CV" onClick={() => run(onUseSample)} />
                <MenuItem icon={FilePlus2} label="Start from blank" onClick={() => run(onStartBlank)} danger />
                <div className="mt-1 flex items-center gap-1.5 border-t border-line-soft px-2.5 pb-0.5 pt-2">
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full",
                      saveState === "saved" ? "bg-forest" : "bg-[#c19a4e]",
                    )}
                  />
                  <span className="text-[9.5px] text-[#8b978d]">
                    {saveState === "saved" ? "Saved in this browser" : "Saving…"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
