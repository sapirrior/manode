export const REGEX = {
  HR: /^(?:[-*_]\s*){3,}$/,
  HEADING: /^(#{1,6})\s+(.*)$/,
  LIST: /^(\*|-|\+|\d+\.)\s+(.*)$/,
  CODE_FENCE: /^```(\w*)/,
  INDENTED_CODE: /^ {4}/,
  LIST_OR_PARAGRAPH_CONT: /^ {4}/
};

export function skipFrontmatter(lines) {
  if (lines[0] === "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "---") return i + 1;
    }
  }
  return 0;
}

export function handleHtmlComments(line, inHtmlComment) {
  const t = line.trim();
  let currentInHtmlComment = inHtmlComment;
  if (t.startsWith("<!--")) currentInHtmlComment = true;
  const shouldSkip = currentInHtmlComment;
  if (currentInHtmlComment && t.includes("-->")) currentInHtmlComment = false;
  return { shouldSkip, inHtmlComment: currentInHtmlComment };
}

export function parseTable(lines, i) {
  const rows = [];
  let curr = i;
  while (curr < lines.length && lines[curr].includes("|")) {
    const t = lines[curr].trim();
    // Split and filter out empty strings only if they are at the edges
    let cells = t.split("|").map(c => c.trim());
    if (t.startsWith("|")) cells.shift();
    if (t.endsWith("|")) cells.pop();
    
    if (cells.length > 0) rows.push(cells);
    else break;
    curr++;
  }
  if (rows.length > 1 && rows[1].every(cell => /^[- :]+$/.test(cell))) {
    rows.splice(1, 1);
    return { rows, nextIndex: curr };
  }
  return null;
}
