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
  if (typeof content !== "string") {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let inCode = false;
  let inHtmlComment = false;
  let lang = "";
  let buffer: string[] = [];

  // Skip YAML frontmatter if it exists at the start
  let startIdx = 0;
  if (lines[0] === "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "---") {
        startIdx = i + 1;
        break;
      }
    }
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    // Handle HTML comments
    if (!inCode) {
      if (t.startsWith("<!--")) {
        inHtmlComment = true;
      }
      if (inHtmlComment) {
        if (t.includes("-->")) {
          inHtmlComment = false;
        }
        continue;
      }
    }

    // Toggle fenced code block state
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

    // Handle empty lines
    if (!t) {
      blocks.push({ type: "spacer" });
      continue;
    }

    // Detect indented code blocks (at least 4 spaces, and not inside a list)
    // Note: This is a simplified check.
    if (line.startsWith("    ") && !/^(?:\s*[*+-]|\s*\d+\.)/.test(line)) {
      // Check if the previous block was also code to merge them
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === "code" && !lang) {
        lastBlock.code += "\n" + line.slice(4);
      } else {
        blocks.push({ type: "code", language: "", code: line.slice(4) });
      }
      continue;
    }

    // Detect horizontal rules
    if (/^(?:[-*_]\s*){3,}$/.test(t)) {
      blocks.push({ type: "hr" });
      continue;
    }

    // Detect headings
    const headingMatch = t.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as any,
        text: headingMatch[2]
      });
      continue;
    }

    // Detect blockquotes
    if (t.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: t.slice(2) });
      continue;
    }

    // Detect list markers
    const listMatch = t.match(/^(\*|-|\+|\d+\.)\s+(.*)$/);
    if (listMatch) {
      blocks.push({ type: "listItem", text: listMatch[2] });
      continue;
    }

    // Continuation of a list item or a paragraph
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.type === "listItem" && line.startsWith("    ")) {
      lastBlock.text += " " + t;
    } else if (lastBlock && lastBlock.type === "paragraph") {
      lastBlock.text += " " + t;
    } else {
      blocks.push({ type: "paragraph", text: t });
    }
  }

  if (inCode) {
    blocks.push({ type: "code", language: lang, code: buffer.join("\n") });
  }

  return blocks;
}

