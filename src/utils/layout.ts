import { Block } from "./parser.js";

/**
 * Represents a styled segment of text within a line.
 */
export type InlineSegment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  dim?: boolean;
};

/**
 * Represents a single line to be rendered in the terminal.
 */
export type RenderLine = {
  segments: InlineSegment[];
  inverse?: boolean;
};

/**
 * Parses a string for inline Markdown styles like bold, italic, and inline code.
 * Returns an array of styled segments.
 */
export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  // Regex to match bold (***, ___, **, __), italic (*, _), and inline code (`)
  // Uses non-greedy matching and word boundaries where appropriate.
  const regex = /(\*\*\*|___|\*\*|__|(?<!\*)\*(?!\*)|(?<!_)_(?!_)|`)(.*?)\1|([^*_`]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [full, marker, inner, plain] = match;

    if (plain) {
      segments.push({ text: plain });
    } else {
      const segment: InlineSegment = { text: inner };
      if (marker === "***" || marker === "___") {
        segment.bold = true;
        segment.italic = true;
      } else if (marker === "**" || marker === "__") {
        segment.bold = true;
      } else if (marker === "*" || marker === "_") {
        segment.italic = true;
      } else if (marker === "`") {
        segment.dim = true;
      }
      segments.push(segment);
    }
  }

  // Ensure at least one segment exists if there was input text
  if (segments.length === 0 && text.length > 0) {
    segments.push({ text });
  }

  return segments;
}

/**
 * Wraps a set of inline segments into multiple lines based on the terminal width.
 * Preserves the styles of each segment across line breaks.
 * This version is hardened to handle words longer than the terminal width by breaking them.
 */
export function wrapSegments(segments: InlineSegment[], width: number, indent: number = 0): InlineSegment[][] {
  // Ensure we have a sane minimum width to prevent infinite loops
  const safeWidth = Math.max(10, width);
  const safeIndent = Math.min(safeWidth - 1, Math.max(0, indent));
  const effectiveWidth = safeWidth - safeIndent;

  const lines: InlineSegment[][] = [];
  let currentLine: InlineSegment[] = [];
  let currentLineWidth = 0;

  /**
   * Finishes the current line and prepares a new one with the specified indentation.
   */
  function startNewLine() {
    if (currentLine.length > 0) {
      // Remove trailing whitespace from the line before pushing
      const lastSegment = currentLine[currentLine.length - 1];
      if (lastSegment && /^\s+$/.test(lastSegment.text)) {
        currentLine.pop();
      }
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    }
    currentLine = [];
    if (safeIndent > 0) {
      currentLine.push({ text: " ".repeat(safeIndent) });
      currentLineWidth = safeIndent;
    } else {
      currentLineWidth = 0;
    }
  }

  // Initialize the first line with indentation
  if (safeIndent > 0) {
    currentLine.push({ text: " ".repeat(safeIndent) });
    currentLineWidth = safeIndent;
  }

  for (const segment of segments) {
    // Split segment text into words and whitespace to handle wrapping
    const parts = segment.text.split(/(\s+)/);

    for (const part of parts) {
      if (!part) continue;

      const isWhitespace = /^\s+$/.test(part);

      if (isWhitespace) {
        // If whitespace doesn't fit, we just start a new line (and whitespace is trimmed by startNewLine)
        if (currentLineWidth + part.length > safeWidth) {
          startNewLine();
        } else {
          currentLine.push({ ...segment, text: part });
          currentLineWidth += part.length;
        }
        continue;
      }

      // Handle words (potentially longer than width)
      let remainingPart = part;
      while (remainingPart.length > 0) {
        const availableSpace = safeWidth - currentLineWidth;

        if (remainingPart.length <= availableSpace) {
          // Word fits in available space
          currentLine.push({ ...segment, text: remainingPart });
          currentLineWidth += remainingPart.length;
          remainingPart = "";
        } else if (currentLineWidth > safeIndent) {
          // Word doesn't fit, and we've already written content on this line. 
          // Move to a new line and try again.
          startNewLine();
        } else {
          // We are on a fresh line (just indent) and the word is STILL too long.
          // We must break the word.
          const chunk = remainingPart.slice(0, availableSpace);
          currentLine.push({ ...segment, text: chunk });
          currentLineWidth += chunk.length;
          remainingPart = remainingPart.slice(availableSpace);
          startNewLine();
        }
      }
    }
  }

  // Push the final line if it contains content beyond the indentation
  if (currentLine.length > (safeIndent > 0 ? 1 : 0)) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Converts high-level Markdown blocks into an array of renderable terminal lines.
 * Handles layout concerns like indentation, spacers, and horizontal rules.
 */
export function getRenderLines(blocks: Block[], width: number): RenderLine[] {
  const lines: RenderLine[] = [];

  for (const b of blocks) {
    switch (b.type) {
      case "spacer":
        lines.push({ segments: [{ text: "" }] });
        break;

      case "hr":
        lines.push({ segments: [{ text: "─".repeat(Math.max(1, width)), dim: true }] });
        break;

      case "heading":
        lines.push({ segments: [{ text: "" }] });
        lines.push({ segments: [{ text: b.text.toUpperCase(), bold: true }] });
        break;

      case "blockquote": {
        const segments = parseInline(b.text);
        const wrapped = wrapSegments(segments, width - 2, 0);
        wrapped.forEach((l) => {
          lines.push({
            segments: [{ text: "│ ", dim: true }, ...l.map(s => ({ ...s, dim: true }))]
          });
        });
        break;
      }

      case "listItem": {
        const segments = parseInline(b.text);
        const wrapped = wrapSegments(segments, width, 4);
        wrapped.forEach((l, i) => {
          if (i === 0) {
            const lineSegments = [...l];
            // Replace leading spaces with a bullet point for the first line
            if (lineSegments[0] && lineSegments[0].text.startsWith("    ")) {
              lineSegments[0] = { ...lineSegments[0], text: "  • " + lineSegments[0].text.slice(4) };
            }
            lines.push({ segments: lineSegments });
          } else {
            lines.push({ segments: l });
          }
        });
        break;
      }

      case "paragraph": {
        const segments = parseInline(b.text);
        const wrapped = wrapSegments(segments, width, 2);
        wrapped.forEach((l) => {
          lines.push({ segments: l });
        });
        break;
      }

      case "code":
        // Render optional language identifier
        if (b.language) {
          lines.push({ segments: [{ text: "  " + b.language, dim: true }] });
        }
        // Render each line of the code block with indentation
        b.code.split("\n").forEach((l) => {
          lines.push({ segments: [{ text: "    " + l }] });
        });
        break;
    }
  }

  return lines;
}
