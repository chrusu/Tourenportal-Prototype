import type { ReactNode } from "react";

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;
// Trailing punctuation that's likely not part of the URL itself (e.g. end of sentence).
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?]+$/;

/**
 * Splits a text into plain-text and clickable-link parts, turning any
 * `http(s)://` URL into a link that opens in a new tab. Non-URL parts are
 * returned unchanged, so surrounding whitespace (e.g. `whitespace-pre-line`)
 * keeps working as before.
 */
export function linkifyText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text))) {
    const start = match.index;
    let url = match[0];

    // Strip trailing punctuation that's part of the sentence, not the URL.
    const trailingMatch = url.match(TRAILING_PUNCTUATION_REGEX);
    let trailing = "";
    if (trailingMatch) {
      trailing = trailingMatch[0];
      url = url.slice(0, url.length - trailing.length);
    }
    if (!url) continue;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <a
        key={`link-${key++}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sac-red underline-offset-2 hover:underline"
      >
        {url}
      </a>
    );

    if (trailing) parts.push(trailing);

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
