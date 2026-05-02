import { parseInline } from "../inline/parseInline.js";
import { wrapSegments } from "../text/wrapSegments.js";

/**
 * Renders a table block into terminal lines using a full classic grid.
 */
export function renderTable(table, width) {
  const rawRows = table.rows;
  if (rawRows.length === 0) return [];
  const colCount = Math.max(...rawRows.map(r => r.length));
  const rows = rawRows.map(r => [...r, ...new Array(colCount - r.length).fill("")]);
  const colWidths = new Array(colCount).fill(0);

  rows.forEach(row => {
    row.forEach((cell, i) => {
      const cleanLen = cell.replace(/[*_`]/g, "").length;
      colWidths[i] = Math.max(colWidths[i], cleanLen);
    });
  });

  const totalGapWidth = colCount + 1 + (colCount * 2); 
  let availableWidth = Math.max(colCount * 2, width - totalGapWidth);
  const finalWidths = new Array(colCount).fill(2);
  availableWidth -= colCount * 2;

  if (availableWidth > 0) {
    const totalDesired = colWidths.reduce((a, b) => a + Math.max(0, b - 2), 0) || 1;
    colWidths.forEach((w, i) => {
      const extra = Math.max(0, w - 2);
      finalWidths[i] += Math.floor(availableWidth * (extra / totalDesired));
    });
    const leftover = (width - totalGapWidth) - finalWidths.reduce((a, b) => a + b, 0);
    if (leftover > 0) finalWidths[colWidths.indexOf(Math.max(...colWidths))] += leftover;
  }

  const lines = [];
  const drawLine = (s, m, e, d) => {
    const str = s + finalWidths.map(w => d.repeat(w + 2)).join(m) + e;
    lines.push({ segments: [{ text: str, dim: true }] });
  };

  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) drawLine("┌", "┬", "┐", "─");
    else drawLine("├", "┼", "┤", "─");

    const cellWrapped = row.map((c, i) => wrapSegments(parseInline(c), finalWidths[i], 0));
    const maxHeight = Math.max(...cellWrapped.map(w => w.length));

    for (let h = 0; h < maxHeight; h++) {
      const lineSegs = [{ text: "│", dim: true }];
      finalWidths.forEach((w, i) => {
        const segs = cellWrapped[i][h] || [];
        let curW = 0;
        lineSegs.push({ text: " " });
        segs.forEach(s => {
          lineSegs.push({ ...s, bold: rowIndex === 0 });
          curW += s.text.length;
        });
        lineSegs.push({ text: " ".repeat(Math.max(0, w - curW)) + " │", dim: true });
      });
      lines.push({ segments: lineSegs });
    }
  });
  drawLine("└", "┴", "┘", "─");
  return lines;
}
