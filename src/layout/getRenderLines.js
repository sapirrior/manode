import { parseInline } from "./parseInline.js";
import { wrapSegments } from "./wrapSegments.js";
import { renderTable } from "./renderTable.js";

/**
 * Converts high-level Markdown blocks into an array of renderable terminal lines.
 * Handles layout concerns like indentation, spacers, and horizontal rules.
 */
export function getRenderLines(blocks, width) {
  const lines = [];

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

      case "table":
        lines.push(...renderTable(b, width));
        break;

      case "code":
        if (b.language) {
          lines.push({ segments: [{ text: "  " + b.language, dim: true }] });
        }
        b.code.split("\n").forEach((l) => {
          const indentedLine = "    " + l;
          if (indentedLine.length > width) {
            lines.push({
              segments: [{ text: indentedLine.slice(0, width - 3) + "..." }]
            });
          } else {
            lines.push({ segments: [{ text: indentedLine }] });
          }
        });
        break;
    }
  }

  return lines;
}
