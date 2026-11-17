import { useEffect, useRef, useState } from "react";
import { Download, FilePlus2, FileText, FolderOpen, MoreHorizontal, RotateCcw, Save, Trash2 } from "lucide-react";
import type { CvProfile } from "@/types";
import { cn } from "@/utils/cn";

function MenuItem({ icon: Icon, label, onClick, danger }: {
  icon: typeof Save;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn("flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition",
        danger ? "text-[#9c4b31] hover:bg-[#f8e9e2]" : "text-ink-soft hover:bg-paper")}>
      <Icon className="h-4 w-4 shrink-0" />{label}
    </button>
  );
}

export function Header({ resumeName, saveState, onPrint, onUseSample, onStartBlank,
  profiles, onSaveProfile, onLoadProfile, onDeleteProfile }: {
  resumeName: string;
  saveState: "saved" | "saving" | "error";
  onPrint: () => void;
  onUseSample: () => void;
  onStartBlank: () => void;
  profiles: CvProfile[];
  onSaveProfile: () => void;
  onLoadProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const run = (action: () => void) => { setMenuOpen(false); action(); };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1800px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5 rounded-lg" aria-label="Plainly home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest max-[359px]:hidden text-white"><FileText className="h-[19px] w-[19px]" /></span>
          <span className="font-display text-[25px] font-semibold tracking-tight text-ink">Plainly<span className="text-forest">.</span></span>
        </a>
        <div className="hidden h-6 w-px bg-line sm:block" />
        <span className="hidden min-w-0 truncate text-sm text-ink-soft sm:block">{resumeName.trim() ? `${resumeName.trim()}’s CV` : "Untitled CV"}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <span role="status" className={cn("hidden items-center gap-2 text-xs sm:flex", saveState === "error" ? "text-[#9c4b31]" : "text-muted")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", saveState === "error" ? "bg-[#9c4b31]" : saveState === "saved" ? "bg-forest" : "bg-[#ab8346]")} />
            {saveState === "saved" ? "Saved on this device" : saveState === "error" ? "Not saved" : "Saving…"}
          </span>
          <button type="button" onClick={onPrint} title="Opens the print dialog. Choose Save as PDF."
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-forest px-3 text-[13px] font-semibold text-white transition hover:bg-forest-2 sm:px-4">
            <Download className="h-4 w-4" /><span>Save PDF</span>
          </button>
          <div className="relative" ref={menuRef}>
            <button ref={triggerRef} type="button" onClick={() => setMenuOpen((prev) => !prev)} aria-label="CV options" aria-expanded={menuOpen} aria-controls="cv-options"
              className={cn("icon-btn !h-10 !w-10 border border-line", menuOpen && "bg-paper")}>
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div id="cv-options" className="absolute right-0 top-full z-50 mt-2 w-[280px] max-w-[calc(100vw-32px)] rounded-xl border border-line bg-white p-2 shadow-xl">
                <p className="px-3 pb-2 pt-2 text-xs font-medium text-muted">Saved versions · {profiles.length}</p>
                <MenuItem icon={Save} label="Save current version…" onClick={() => run(onSaveProfile)} />
                {profiles.length > 0 && (
                  <div className="max-h-52 overflow-y-auto">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center gap-1 rounded-lg pl-3 hover:bg-paper">
                        <button type="button" onClick={() => run(() => onLoadProfile(profile.id))} className="flex min-h-12 min-w-0 flex-1 items-center gap-3 text-left" title={`Load ${profile.name}`}>
                          <FolderOpen className="h-4 w-4 shrink-0 text-muted" />
                          <span className="min-w-0 py-1"><span className="block truncate text-[13px] text-ink">{profile.name}</span>
                            <span className="block text-xs text-muted">{new Date(profile.savedAt).toLocaleDateString()}</span></span>
                        </button>
                        <button type="button" onClick={() => onDeleteProfile(profile.id)} className="icon-btn hover:!text-[#9c4b31]" aria-label={`Delete version ${profile.name}`}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="my-2 border-t border-line" />
                <MenuItem icon={RotateCcw} label="Load example CV" onClick={() => run(onUseSample)} />
                <MenuItem icon={FilePlus2} label="Start a new CV" onClick={() => run(onStartBlank)} danger />
                <p className="mx-3 mb-1 mt-3 border-t border-line pt-3 text-xs leading-5 text-muted">CVs stay in this browser. Clearing browser data removes saved versions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
