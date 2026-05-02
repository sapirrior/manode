/**
 * Wraps a set of inline segments into multiple lines based on the terminal width.
 * Preserves the styles of each segment across line breaks.
 */
export function wrapSegments(segments, width, indent = 0) {
  const safeWidth = Math.max(1, width);
  const safeIndent = Math.min(safeWidth - 1, Math.max(0, indent));
  const lines = [];
  let currentLine = [];
  let currentLineWidth = 0;

  function startNewLine() {
    if (currentLine.length > 0) {
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

  if (safeIndent > 0) {
    currentLine.push({ text: " ".repeat(safeIndent) });
    currentLineWidth = safeIndent;
  }

  for (const segment of segments) {
    const parts = segment.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      const isWhitespace = /^\s+$/.test(part);
      if (isWhitespace) {
        if (currentLineWidth + part.length > safeWidth) {
          startNewLine();
        } else {
          currentLine.push({ ...segment, text: part });
          currentLineWidth += part.length;
        }
        continue;
      }
      let remainingPart = part;
      while (remainingPart.length > 0) {
        const availableSpace = safeWidth - currentLineWidth;
        if (remainingPart.length <= availableSpace) {
          currentLine.push({ ...segment, text: remainingPart });
          currentLineWidth += remainingPart.length;
          remainingPart = "";
        } else if (currentLineWidth > safeIndent) {
          startNewLine();
        } else {
          const chunk = remainingPart.slice(0, availableSpace);
          currentLine.push({ ...segment, text: chunk });
          currentLineWidth += chunk.length;
          remainingPart = remainingPart.slice(availableSpace);
          startNewLine();
        }
      }
    }
  }
  if (currentLine.length > (safeIndent > 0 ? 1 : 0)) {
    lines.push(currentLine);
  }
  return lines;
}
