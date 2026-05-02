export function parseTable(lines, i) {
  const rows = [];
  let curr = i;
  while (curr < lines.length && lines[curr].includes("|")) {
    const t = lines[curr].trim();
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
