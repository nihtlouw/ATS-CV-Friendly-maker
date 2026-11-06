import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Eye, FileDown, FileText, Maximize, Minus, Plus, Printer } from "lucide-react";
import type { Design, Resume, SectionKey } from "@/types";
import { ACCENTS, FONTS, PAPER_SIZES } from "@/lib/ats";
import { cn } from "@/utils/cn";
import { InlineText } from "@/components/InlineText";

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "Arial, Helvetica, 'Liberation Sans', sans-serif";

type TemplateConfig = {
  font: string;
  nameSize: number;
  nameWeight: number;
  nameTracking: string;
  headlineSize: number;
  headlineTracking: string;
  contactSize: number;
  sectionSize: number;
  bodySize: number;
  headingColor: string;
  headingRule: string;
  headingBar: boolean;
  headingUppercase: boolean;
  headingBold: boolean;
  accent: string;
  nameAlign: "left" | "center";
  headerRule: string;
  headerRuleWidth: number;
  headerFollowsAccent: boolean;
  nameserif: boolean;
  metaItalic: boolean;
  padComfortable: number;
  padCompact: number;
  densityTrim: number;
};

const templateConfig: Record<Design["template"], TemplateConfig> = {
  classic: {
    font: SERIF,
    nameSize: 38,
    nameWeight: 400,
    nameTracking: "-0.005em",
    headlineSize: 10.5,
    headlineTracking: "0.2em",
    contactSize: 10.8,
    sectionSize: 10.4,
    bodySize: 12.6,
    headingColor: "#1b2a23",
    headingRule: "#c9d1c9",
    headingBar: false,
    headingUppercase: false,
    headingBold: false,
    accent: "#355c46",
    nameAlign: "center",
    headerRule: "#1b2a23",
    headerRuleWidth: 1.5,
    headerFollowsAccent: false,
    nameserif: true,
    metaItalic: true,
    padComfortable: 52,
    padCompact: 42,
    densityTrim: 0.8,
  },
  modern: {
    font: SANS,
    nameSize: 34,
    nameWeight: 700,
    nameTracking: "-0.02em",
    headlineSize: 10.5,
    headlineTracking: "0.18em",
    contactSize: 10.5,
    sectionSize: 10,
    bodySize: 12.4,
    headingColor: "#1b4b39",
    headingRule: "#dde4dc",
    headingBar: false,
    headingUppercase: false,
    headingBold: false,
    accent: "#1b4b39",
    nameAlign: "left",
    headerRule: "#1b4b39",
    headerRuleWidth: 2,
    headerFollowsAccent: true,
    nameserif: false,
    metaItalic: false,
    padComfortable: 52,
    padCompact: 42,
    densityTrim: 0.3,
  },
  compact: {
    font: SANS,
    nameSize: 29,
    nameWeight: 700,
    nameTracking: "-0.02em",
    headlineSize: 9.5,
    headlineTracking: "0.16em",
    contactSize: 9.6,
    sectionSize: 9.4,
    bodySize: 11.8,
    headingColor: "#22352a",
    headingRule: "#e0e5df",
    headingBar: false,
    headingUppercase: false,
    headingBold: false,
    accent: "#355944",
    nameAlign: "left",
    headerRule: "#b9c4bb",
    headerRuleWidth: 2,
    headerFollowsAccent: false,
    nameserif: false,
    metaItalic: false,
    padComfortable: 44,
    padCompact: 40,
    densityTrim: 0.8,
  },
  minimal: {
    font: SANS,
    nameSize: 32,
    nameWeight: 400,
    nameTracking: "0.01em",
    headlineSize: 10,
    headlineTracking: "0.22em",
    contactSize: 10,
    sectionSize: 9.8,
    bodySize: 12.8,
    headingColor: "#3a3f3a",
    headingRule: "#e6e9e4",
    headingBar: false,
    headingUppercase: false,
    headingBold: false,
    accent: "#6b7280",
    nameAlign: "left",
    headerRule: "#d8dcd5",
    headerRuleWidth: 1,
    headerFollowsAccent: false,
    nameserif: false,
    metaItalic: false,
    padComfortable: 56,
    padCompact: 46,
    densityTrim: 0.8,
  },
  executive: {
    font: SERIF,
    nameSize: 36,
    nameWeight: 700,
    nameTracking: "-0.01em",
    headlineSize: 10.5,
    headlineTracking: "0.2em",
    contactSize: 10.5,
    sectionSize: 10.6,
    bodySize: 12.4,
    headingColor: "#111827",
    headingRule: "#c3c9d1",
    headingBar: false,
    headingUppercase: false,
    headingBold: false,
    accent: "#111827",
    nameAlign: "left",
    headerRule: "#111827",
    headerRuleWidth: 2.5,
    headerFollowsAccent: false,
    nameserif: true,
    metaItalic: false,
    padComfortable: 54,
    padCompact: 44,
    densityTrim: 0.6,
  },
  technical: {
    font: SANS,
    nameSize: 33,
    nameWeight: 700,
    nameTracking: "-0.02em",
    headlineSize: 10,
    headlineTracking: "0.18em",
    contactSize: 10.2,
    sectionSize: 10,
    bodySize: 12.2,
    headingColor: "#0f4c5c",
    headingRule: "#d3e2e6",
    headingBar: true,
    headingUppercase: false,
    headingBold: false,
    accent: "#0f4c5c",
    nameAlign: "left",
    headerRule: "#0f4c5c",
    headerRuleWidth: 2,
    headerFollowsAccent: true,
    nameserif: false,
    metaItalic: false,
    padComfortable: 50,
    padCompact: 42,
    densityTrim: 0.5,
  },
  formal: {
    font: SERIF,
    nameSize: 40,
    nameWeight: 700,
    nameTracking: "0.01em",
    headlineSize: 10.5,
    headlineTracking: "0.18em",
    contactSize: 10.5,
    sectionSize: 11,
    bodySize: 12.2,
    headingColor: "#111111",
    headingRule: "#111111",
    headingBar: false,
    headingUppercase: true,
    headingBold: true,
    accent: "#111111",
    nameAlign: "center",
    headerRule: "#111111",
    headerRuleWidth: 1.5,
    headerFollowsAccent: false,
    nameserif: true,
    metaItalic: true,
    padComfortable: 50,
    padCompact: 42,
    densityTrim: 0.6,
  },
};

function SectionHeading({
  children,
  config,
  density,
  accentHex,
  align = "left",
  fontStack = SANS,
}: {
  children: string;
  config: TemplateConfig;
  density: Design["density"];
  accentHex: string;
  align?: "left" | "center";
  fontStack?: string;
}) {
  return (
    <h2
      className="rs-section-title"
      style={{
        fontFamily: fontStack,
        fontSize: config.sectionSize,
        fontWeight: config.headingBold ? 700 : undefined,
        textTransform: config.headingUppercase ? "uppercase" : undefined,
        letterSpacing: config.headingUppercase ? "0.08em" : "0.15em",
        textAlign: align,
        color: config.headingColor,
        borderBottom: `1px solid ${config.headingRule}`,
        borderLeft: config.headingBar ? `3px solid ${accentHex}` : undefined,
        paddingLeft: config.headingBar ? 7 : undefined,
        paddingBottom: density === "compact" ? 2 : 3,
        marginBottom: density === "compact" ? 5 : 7,
      }}
    >
      {children}
    </h2>
  );
}

export function ResumeSheet({
  resume,
  design,
  id = "resume-paper",
}: {
  resume: Resume;
  design: Design;
  id?: string;
}) {
  const paper = PAPER_SIZES[design.paper];
  const config = templateConfig[design.template];
  const compact = design.density === "compact";
  const accentHex = ACCENTS[design.accent]?.hex ?? config.accent;
  const fontStack = FONTS[design.font]?.stack ?? SANS;
  const pad = compact ? config.padCompact : config.padComfortable;
  const densityTrim = compact ? config.densityTrim : 0;
  const body = config.bodySize - densityTrim;
  const sectionGap = compact ? 10 : 14;
  const entryGap = compact ? 8 : 11;
  const bulletGap = compact ? 1.5 : 2.5;

  const contactLine = [resume.location, resume.phone, resume.email, resume.linkedin]
    .map((value) => value.trim())
    .filter(Boolean);

  const visible = design.visible;
  const order: SectionKey[] = design.sectionOrder?.length
    ? design.sectionOrder
    : ["summary", "skills", "softSkills", "experience", "education", "certifications", "awards"];

  const heading = (label: string) => (
    <SectionHeading
      config={config}
      density={design.density}
      accentHex={accentHex}
      align={design.headingAlign}
      fontStack={fontStack}
    >
      {label}
    </SectionHeading>
  );

  const renderContact = () =>
    contactLine.length > 0 ? (
      <p
        className="rs-contact"
        style={{
          fontFamily: fontStack,
          fontSize: config.contactSize,
          marginTop: compact ? 6 : 8,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: config.nameAlign === "center" ? "center" : "flex-start",
          columnGap: 9,
          rowGap: 2,
        }}
      >
        {contactLine.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            {index < contactLine.length - 1 && (
              <span style={{ color: "#9aa59c", paddingLeft: 9 }}>·</span>
            )}
          </span>
        ))}
      </p>
    ) : null;

  const sections: Record<SectionKey, ReactNode> = {
    summary:
      visible.summary && resume.summary.trim() ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Professional Summary")}
          <p className="rs-paragraph" style={{ fontSize: body }}>
            <InlineText text={resume.summary.trim()} />
          </p>
        </section>
      ) : null,
    skills:
      visible.skills && resume.skills.length > 0 ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Core Skills")}
          {design.skillsStyle === "bullets" ? (
            <ul className="rs-bullets" style={{ marginTop: 0, fontSize: body - 0.2 }}>
              {resume.skills.map((skill, index) => (
                <li key={skill} style={{ marginTop: index === 0 ? 0 : bulletGap }}>
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rs-skill-list" style={{ fontSize: body - 0.2 }}>
              {resume.skills.join(", ")}
            </p>
          )}
        </section>
      ) : null,
    softSkills:
      visible.softSkills && (resume.softSkills ?? []).length > 0 ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Soft Skills")}
          {design.skillsStyle === "bullets" ? (
            <ul className="rs-bullets" style={{ marginTop: 0, fontSize: body - 0.2 }}>
              {(resume.softSkills ?? []).map((skill, index) => (
                <li key={skill} style={{ marginTop: index === 0 ? 0 : bulletGap }}>
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rs-skill-list" style={{ fontSize: body - 0.2 }}>
              {(resume.softSkills ?? []).join(", ")}
            </p>
          )}
        </section>
      ) : null,
    experience:
      visible.experience &&
      resume.experience.some((job) => job.role.trim() || job.company.trim()) ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Work Experience")}
          <div>
            {resume.experience.map((job, index) => {
              if (!job.role.trim() && !job.company.trim()) return null;
              const date = [job.start.trim(), job.end.trim()].filter(Boolean).join(" – ");
              const bullets = job.bullets.map((bullet) => bullet.trim()).filter(Boolean);
              return (
                <div
                  key={job.id}
                  style={{ marginTop: index === 0 ? 0 : entryGap }}
                  className="break-inside-avoid"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <h3 className="rs-role" style={{ fontSize: body + 0.9, margin: 0 }}>
                      {job.role.trim() || "Role"}
                    </h3>
                    {date && (
                      <span className="rs-date" style={{ fontSize: body - 1, whiteSpace: "nowrap" }}>
                        {date}
                      </span>
                    )}
                  </div>
                  {(job.company.trim() || job.location.trim()) && (
                    <div
                      className="rs-meta"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: body - 0.9,
                        marginTop: 1,
                        fontStyle: config.metaItalic ? "italic" : "normal",
                      }}
                    >
                      <span className="rs-company">{job.company.trim()}</span>
                      <span style={{ whiteSpace: "nowrap" }}>{job.location.trim()}</span>
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul
                      className="rs-bullets"
                      style={{ marginTop: compact ? 3 : 4, fontSize: body - 0.4 }}
                    >
                      {bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} style={{ marginTop: bulletIndex === 0 ? 0 : bulletGap }}>
                          <InlineText text={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null,
    education:
      visible.education &&
      resume.education.some((entry) => entry.degree.trim() || entry.school.trim()) ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Education")}
          {resume.education.map((entry, index) => {
            if (!entry.degree.trim() && !entry.school.trim()) return null;
            return (
              <div key={entry.id} style={{ marginTop: index === 0 ? 0 : entryGap - 2 }}>
                <div className="break-inside-avoid">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <h3 className="rs-role" style={{ fontSize: body + 0.6, margin: 0 }}>
                      {entry.degree.trim() || "Degree"}
                    </h3>
                    {entry.year.trim() && (
                      <span className="rs-date" style={{ fontSize: body - 1 }}>
                        {entry.year.trim()}
                      </span>
                    )}
                  </div>
                  <div
                    className="rs-meta"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      fontSize: body - 0.9,
                      marginTop: 1,
                      fontStyle: config.metaItalic ? "italic" : "normal",
                    }}
                  >
                    <span>{entry.school.trim()}</span>
                    <span style={{ whiteSpace: "nowrap" }}>{entry.location.trim()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : null,
    certifications:
      visible.certifications &&
      resume.certifications.some((entry) => entry.name.trim()) ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Certifications")}
          {resume.certifications.map((entry, index) =>
            entry.name.trim() ? (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: body - 0.2,
                  marginTop: index === 0 ? 0 : compact ? 1 : 2,
                  color: "#2b3a31",
                }}
              >
                <span>
                  <span className="rs-company">{entry.name.trim()}</span>
                  {entry.issuer.trim() && (
                    <span style={{ color: "#5a6a60" }}> — {entry.issuer.trim()}</span>
                  )}
                </span>
                {entry.year.trim() && (
                  <span className="rs-date" style={{ fontSize: body - 1 }}>
                    {entry.year.trim()}
                  </span>
                )}
              </div>
            ) : null,
          )}
        </section>
      ) : null,
    awards:
      visible.awards &&
      (resume.awards ?? []).some((entry) => entry.title.trim()) ? (
        <section style={{ marginTop: sectionGap }}>
          {heading("Awards")}
          <ul className="rs-bullets" style={{ marginTop: 0, fontSize: body - 0.2 }}>
            {(resume.awards ?? []).map((entry, index) =>
              entry.title.trim() ? (
                <li key={entry.id} style={{ marginTop: index === 0 ? 0 : bulletGap }}>
                  <span className="rs-company">{entry.title.trim()}</span>
                  {entry.issuer.trim() && (
                    <span style={{ color: "#5a6a60" }}>, {entry.issuer.trim()}</span>
                  )}
                  {entry.year.trim() && (
                    <span style={{ color: "#5a6a60" }}> ({entry.year.trim()})</span>
                  )}
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null,
  };

  return (
    <div
      id={id}
      className="resume-sheet"
      style={{
        width: paper.width,
        minHeight: paper.height,
        padding: pad,
        fontFamily: fontStack,
        fontSize: body,
        flexShrink: 0,
      }}
    >
      <header
        style={{
          borderBottom: `${config.headerRuleWidth}px solid ${config.headerFollowsAccent ? accentHex : config.headerRule}`,
          paddingBottom: compact ? 8 : 11,
          textAlign: config.nameAlign,
        }}
      >
        <h1
          className="rs-name"
          style={{
            fontFamily: config.nameserif ? SERIF : fontStack,
            fontSize: config.nameSize,
            fontWeight: config.nameWeight,
            letterSpacing: config.nameTracking,
            textAlign: config.nameAlign,
          }}
        >
          {resume.name.trim() || "Your Name"}
        </h1>
        {resume.title.trim() && (
          <p
            className="rs-headline"
            style={{
              fontSize: config.headlineSize,
              letterSpacing: config.headlineTracking,
              color: accentHex,
              marginTop: compact ? 4 : 6,
            }}
          >
            {resume.title.trim()}
          </p>
        )}
        {renderContact()}
      </header>

      {!resume.summary.trim() &&
        !resume.skills.length &&
        !resume.experience.some((job) => job.role.trim() || job.company.trim()) &&
        !resume.education.some((entry) => entry.degree.trim() || entry.school.trim()) &&
        !resume.certifications.some((entry) => entry.name.trim()) && (
          <div
            className="no-print"
            style={{
              marginTop: 64,
              textAlign: "center",
              fontFamily: SANS,
              color: "#9aa59c",
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, color: "#6f7d73", margin: 0 }}>
              Your CV starts here
            </p>
            <p style={{ fontSize: 10.5, marginTop: 4, lineHeight: 1.6 }}>
              Add your target role and contact details in the panel.
              <br />
              Then write two or three lines of summary.
            </p>
          </div>
        )}

      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </div>
  );
}

export function PrintSheet({ resume, design }: { resume: Resume; design: Design }) {
  const paper = PAPER_SIZES[design.paper];
  return (
    <div id="print-root" aria-hidden="true" className="hidden">
      <style>{`@media print { @page { size: ${paper.print}; margin: 0; } }`}</style>
      <ResumeSheet id="print-paper" resume={resume} design={design} />
    </div>
  );
}

export function Preview({
  resume,
  design,
  onPrint,
  onDownloadTxt,
}: {
  resume: Resume;
  design: Design;
  onPrint: () => void;
  onDownloadTxt: () => void;
}) {
  const paper = PAPER_SIZES[design.paper];
  const stageRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [autoScale, setAutoScale] = useState(0.62);
  const [manualScale, setManualScale] = useState<number | null>(null);
  const scale = manualScale ?? autoScale;
  const [contentHeight, setContentHeight] = useState<number>(paper.height);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setContentHeight(paper.height);
  }, [paper.height]);

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = paperRef.current;
    if (!stage || !sheet) return;

    const measureScale = () => {
      const availableWidth = stage.clientWidth - 32;
      const availableHeight = stage.clientHeight - 32;
      if (availableWidth <= 0 || availableHeight <= 0) return;
      const next = Math.min(
        availableWidth / paper.width,
        availableHeight / Math.max(paper.height, contentHeight),
        1,
      );
      setAutoScale(Math.max(0.22, Number(next.toFixed(4))));
    };

    const measureSheet = () => {
      const height = sheet.scrollHeight;
      setContentHeight(height);
      setPages(Math.max(1, Math.ceil((height - 12) / paper.height)));
    };

    measureScale();
    measureSheet();

    const stageObserver = new ResizeObserver(measureScale);
    const sheetObserver = new ResizeObserver(measureSheet);
    stageObserver.observe(stage);
    sheetObserver.observe(sheet);
    return () => {
      stageObserver.disconnect();
      sheetObserver.disconnect();
    };
  }, [paper.width, paper.height, contentHeight, resume, design]);

  const renderedHeight = Math.max(paper.height, contentHeight);

  const zoomBy = (delta: number) => {
    const base = manualScale ?? autoScale;
    setManualScale(Math.min(2, Math.max(0.22, Number((base + delta).toFixed(4)))));
  };
  const zoomFit = () => setManualScale(null);

  return (
    <aside className="min-w-0 lg:sticky lg:top-[80px]">
      <div className="no-print flex h-[520px] flex-col overflow-hidden rounded-2xl border border-line bg-paper-2/60 shadow-card sm:h-[600px] lg:h-[calc(100vh-100px)] lg:min-h-[560px]">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-line bg-cream/85 px-3.5">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-forest" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
              Live preview
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#b9c2b8] sm:block" />
            <div className="hidden items-center gap-0.5 sm:flex" role="group" aria-label="Zoom preview">
              <button
                type="button"
                onClick={() => zoomBy(-0.1)}
                className="icon-btn !h-5 !w-5"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <Minus className="h-2.5 w-2.5" />
              </button>
              <span className="w-9 text-center font-mono text-[9.5px] tabular-nums text-muted">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomBy(0.1)}
                className="icon-btn !h-5 !w-5"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <Plus className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={zoomFit}
                className={cn(
                  "icon-btn !h-5 !w-5",
                  manualScale === null && "bg-forest/[0.08] text-forest",
                )}
                aria-label="Fit to window"
                title="Fit to window"
              >
                <Maximize className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "mr-1 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
                pages > 1
                  ? "border-[#dfc7a4] bg-[#f7eddc] text-[#96602c]"
                  : "border-forest/15 bg-forest/[0.06] text-forest",
              )}
            >
              <FileText className="h-2.5 w-2.5" />
              {pages} {pages === 1 ? "page" : "pages"}
            </span>
            <button
              type="button"
              onClick={onDownloadTxt}
              className="icon-btn"
              aria-label="Download plain text CV"
              title="Download plain text (.txt)"
            >
              <FileDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="icon-btn"
              aria-label="Print or save as PDF"
              title="Print or save as PDF"
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={stageRef} className={cn("preview-stage relative flex flex-1 p-4", manualScale === null ? "items-center justify-center overflow-hidden" : "overflow-auto")}>
          <div
            style={{
              width: paper.width * scale,
              height: renderedHeight * scale,
              position: "relative",
            }}
            className={cn("transition-[width,height] duration-200", manualScale !== null && "m-auto")}
          >
            <div
              ref={paperRef}
              className="resume-scale-wrap"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
                boxShadow:
                  "0 1px 2px rgba(27,42,35,0.10), 0 18px 40px -18px rgba(27,42,35,0.42)",
              }}
            >
              <ResumeSheet resume={resume} design={design} />
              {pages > 1 &&
                Array.from({ length: pages - 1 }).map((_, index) => (
                  <div
                    key={index}
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-clay/40"
                    style={{ top: paper.height * (index + 1) }}
                  >
                    <span className="absolute right-2 top-1 rounded bg-[#faf4ea] px-1 font-mono text-[8px] uppercase tracking-wide text-clay">
                      page {index + 2}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-t border-line bg-cream/75 px-3.5">
          <p className="flex min-w-0 items-center gap-1.5 text-[9.5px] text-muted">
            <Check className="h-3 w-3 shrink-0 text-forest" strokeWidth={2.6} />
            <span className="truncate">
              Single column · standard headings · {paper.label}
            </span>
          </p>
          {pages > 1 ? (
            <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-wide text-clay">
              trim to 1 page
            </span>
          ) : (
            <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-wide text-[#8b978d]">
              ATS safe
            </span>
          )}
        </div>
      </div>
      <p className="no-print mt-2 px-1 text-center font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-[#98a298]">
        PDF export opens your print dialog — choose “Save as PDF”
      </p>
    </aside>
  );
}
