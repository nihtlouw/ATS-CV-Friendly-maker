import { useEffect, useRef, useState } from "react";
import { Check, Eye, FileDown, FileText, Printer } from "lucide-react";
import type { Design, Resume } from "@/types";
import { PAPER_SIZES } from "@/lib/ats";
import { cn } from "@/utils/cn";

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "Arial, Helvetica, 'Liberation Sans', sans-serif";

type TemplateConfig = {
  font: string;
  nameSize: number;
  nameWeight: number;
  headlineSize: number;
  headlineTracking: string;
  contactSize: number;
  sectionSize: number;
  bodySize: number;
  headingColor: string;
  headingRule: string;
  accent: string;
  nameAlign: "left" | "center";
  headerRule: string;
  nameserif: boolean;
};

const templateConfig: Record<Design["template"], TemplateConfig> = {
  classic: {
    font: SERIF,
    nameSize: 38,
    nameWeight: 400,
    headlineSize: 10.5,
    headlineTracking: "0.2em",
    contactSize: 10.8,
    sectionSize: 10.4,
    bodySize: 12.6,
    headingColor: "#1b2a23",
    headingRule: "#c9d1c9",
    accent: "#355c46",
    nameAlign: "center",
    headerRule: "#1b2a23",
    nameserif: true,
  },
  modern: {
    font: SANS,
    nameSize: 34,
    nameWeight: 700,
    headlineSize: 10.5,
    headlineTracking: "0.18em",
    contactSize: 10.5,
    sectionSize: 10,
    bodySize: 12.4,
    headingColor: "#1b4b39",
    headingRule: "#dde4dc",
    accent: "#1b4b39",
    nameAlign: "left",
    headerRule: "#1b4b39",
    nameserif: false,
  },
  compact: {
    font: SANS,
    nameSize: 29,
    nameWeight: 700,
    headlineSize: 9.5,
    headlineTracking: "0.16em",
    contactSize: 9.6,
    sectionSize: 9.4,
    bodySize: 11.8,
    headingColor: "#22352a",
    headingRule: "#e0e5df",
    accent: "#355944",
    nameAlign: "left",
    headerRule: "#b9c4bb",
    nameserif: false,
  },
};

function SectionHeading({
  children,
  config,
  density,
}: {
  children: string;
  config: TemplateConfig;
  density: Design["density"];
}) {
  return (
    <h2
      className="rs-section-title"
      style={{
        fontFamily: config.font,
        fontSize: config.sectionSize,
        letterSpacing: "0.15em",
        color: config.headingColor,
        borderBottom: `1px solid ${config.headingRule}`,
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
  const pad = compact ? (design.template === "compact" ? 40 : 42) : design.template === "compact" ? 44 : 52;
  const densityTrim = compact ? (design.template === "modern" ? 0.3 : 0.8) : 0;
  const body = config.bodySize - densityTrim;
  const sectionGap = compact ? 10 : 14;
  const entryGap = compact ? 8 : 11;
  const bulletGap = compact ? 1.5 : 2.5;

  const contactLine = [resume.location, resume.phone, resume.email, resume.linkedin]
    .map((value) => value.trim())
    .filter(Boolean);

  const visible = design.visible;

  const renderContact = () =>
    contactLine.length > 0 ? (
      <p
        className="rs-contact"
        style={{
          fontFamily: config.font,
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

  return (
    <div
      id={id}
      className="resume-sheet"
      style={{
        width: paper.width,
        minHeight: paper.height,
        padding: pad,
        fontFamily: config.font,
        fontSize: body,
        flexShrink: 0,
      }}
    >
      <header
        style={{
          borderBottom: design.template === "classic" ? "1.5px solid #1b2a23" : `2px solid ${config.headerRule}`,
          paddingBottom: compact ? 8 : 11,
          textAlign: config.nameAlign,
        }}
      >
        <h1
          className="rs-name"
          style={{
            fontFamily: config.nameserif ? SERIF : SANS,
            fontSize: config.nameSize,
            fontWeight: config.nameWeight,
            letterSpacing: design.template === "classic" ? "-0.005em" : "-0.02em",
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
              color: config.accent,
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

      {visible.summary && resume.summary.trim() && (
        <section style={{ marginTop: sectionGap }}>
          <SectionHeading config={config} density={design.density}>
            Professional Summary
          </SectionHeading>
          <p className="rs-paragraph" style={{ fontSize: body }}>
            {resume.summary.trim()}
          </p>
        </section>
      )}

      {visible.skills && resume.skills.length > 0 && (
        <section style={{ marginTop: sectionGap }}>
          <SectionHeading config={config} density={design.density}>
            Core Skills
          </SectionHeading>
          <p className="rs-skill-list" style={{ fontSize: body - 0.2 }}>
            {resume.skills.join(", ")}
          </p>
        </section>
      )}

      {visible.experience &&
        resume.experience.some((job) => job.role.trim() || job.company.trim()) && (
          <section style={{ marginTop: sectionGap }}>
            <SectionHeading config={config} density={design.density}>
              Work Experience
            </SectionHeading>
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
                          fontStyle: design.template === "classic" ? "italic" : "normal",
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
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      {visible.education &&
        resume.education.some((entry) => entry.degree.trim() || entry.school.trim()) && (
          <section style={{ marginTop: sectionGap }}>
            <SectionHeading config={config} density={design.density}>
              Education
            </SectionHeading>
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
                        fontStyle: design.template === "classic" ? "italic" : "normal",
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
        )}

      {visible.certifications &&
        resume.certifications.some((entry) => entry.name.trim()) && (
          <section style={{ marginTop: sectionGap }}>
            <SectionHeading config={config} density={design.density}>
              Certifications
            </SectionHeading>
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
        )}
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
  const [scale, setScale] = useState(0.62);
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
      setScale(Math.max(0.22, Number(next.toFixed(4))));
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
            <span className="hidden font-mono text-[9.5px] text-muted sm:block">
              {Math.round(scale * 100)}%
            </span>
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

        <div ref={stageRef} className="preview-stage relative flex flex-1 items-center justify-center overflow-hidden p-4">
          <div
            style={{
              width: paper.width * scale,
              height: renderedHeight * scale,
              position: "relative",
            }}
            className="transition-[width,height] duration-200"
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
