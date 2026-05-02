export class Renderer {
  static draw(state) {
    const { rows, cols, scrollY, renderLines, topic } = state;
    const viewportHeight = rows - 1;
    const visibleLines = renderLines.slice(scrollY, scrollY + viewportHeight);
    let output = "\x1b[?25l\x1b[2J\x1b[H";
    for (let i = 0; i < viewportHeight; i++) {
      const line = visibleLines[i];
      if (line) output += this.formatLine(line);
      if (i < viewportHeight - 1) output += "\n";
    }
    const statusBar = `Node Manual Pages: ${topic} (q to exit)`.padEnd(cols - 1);
    output += `\x1b[${rows};1H\x1b[7m ${statusBar}\x1b[0m`;
    process.stdout.write(output);
  }

  static formatLine(line) {
    let output = "";
    for (const s of line.segments) {
      if (s.bold) output += "\x1b[1m";
      if (s.dim) output += "\x1b[2m";
      if (s.italic) output += "\x1b[3m";
      output += s.text;
      output += "\x1b[0m";
    }
    return output;
  }
}
