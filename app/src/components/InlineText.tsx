import type { CSSProperties, ReactNode } from "react";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;

/**
 * Renders plain text with light inline formatting:
 *   **bold** or __bold__  -> <strong>
 *   *italic* or _italic_  -> <em>
 * Everything stays real, selectable text — safe for ATS parsing and PDF export.
 */
export function InlineText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const token = match[0];
    const isBold = token.startsWith("**") || token.startsWith("__");
    const inner = isBold ? token.slice(2, -2) : token.slice(1, -1);
    parts.push(
      isBold ? (
        <strong key={key++}>{inner}</strong>
      ) : (
        <em key={key++}>{inner}</em>
      ),
    );
    last = index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <span className={className} style={style}>
      {parts}
    </span>
  );
}
