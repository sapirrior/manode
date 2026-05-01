/**
 * Represents a logical block of Markdown content.
 */
export type Block =
  | { type: "spacer" }
  | { type: "hr" }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "blockquote"; text: string }
  | { type: "listItem"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string };

/**
 * Parses raw Markdown content into a flat array of blocks.
 * This function handles block-level elements like headings, lists, and code blocks.
 */
export function parse(content: string): Block[] {
  // Ensure content is a string
  if (typeof content !== "string") {
    return [];
  }

  // Handle both Unix and Windows line endings
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let inCode = false;
  let lang = "";
  let buffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    // Toggle code block state and collect lines into the buffer
    if (t.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", language: lang, code: buffer.join("\n") });
        inCode = false;
        buffer = [];
        lang = "";
      } else {
        inCode = true;
        const langMatch = t.match(/^```(\w*)/);
        lang = langMatch ? langMatch[1] : "";
      }
      continue;
    }

    if (inCode) {
      buffer.push(line);
      continue;
    }

    // Handle empty lines as spacers for layout
    if (!t) {
      blocks.push({ type: "spacer" });
      continue;
    }

    // Detect horizontal rules (3 or more dashes, stars, or underscores)
    if (/^(?:[-*_]\s*){3,}$/.test(t)) {
      blocks.push({ type: "hr" });
      continue;
    }

    // Detect headings (1 to 6 hash marks followed by text)
    const headingMatch = t.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as any,
        text: headingMatch[2]
      });
      continue;
    }

    // Detect blockquotes starting with '>'
    if (t.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: t.slice(2) });
      continue;
    }

    // Detect various list markers (-, *, +, or numbered lists)
    const listMatch = t.match(/^(\*|-|\+|\d+\.)\s+(.*)$/);
    if (listMatch) {
      blocks.push({ type: "listItem", text: listMatch[2] });
      continue;
    }

    // Fallback to treat the line as a paragraph
    blocks.push({ type: "paragraph", text: t });
  }

  // Handle unclosed code blocks at the end of content
  if (inCode) {
    blocks.push({ type: "code", language: lang, code: buffer.join("\n") });
  }

  return blocks;
}
