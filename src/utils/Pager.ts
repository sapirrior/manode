import { parse, Block } from "./parser.js";
import { getRenderLines, RenderLine } from "./layout.js";

/**
 * Manual Pager handles terminal state, input, and rendering without React/Ink.
 * It uses ANSI escape sequences for styling and layout.
 */
export class Pager {
  private scrollY = 0;
  private rows = process.stdout.rows || 24;
  private cols = process.stdout.columns || 80;
  private blocks: Block[];
  private renderLines: RenderLine[] = [];
  private topic: string;
  private resolveExit?: () => void;

  constructor(content: string, topic: string) {
    this.topic = topic;
    this.blocks = parse(content);
    this.updateRenderLines();
  }

  /**
   * Starts the pager loop and returns a promise that resolves when the user exits.
   */
  public async start(): Promise<void> {
    // Setup terminal
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    // Initial draw
    this.draw();

    // Event listeners
    process.stdout.on("resize", this.handleResize);
    process.stdin.on("data", this.handleInput);

    return new Promise((resolve) => {
      this.resolveExit = resolve;
    });
  }

  private updateRenderLines() {
    this.renderLines = getRenderLines(this.blocks, this.cols);
    const viewportHeight = this.rows - 1;
    const maxScroll = Math.max(0, this.renderLines.length - viewportHeight);
    if (this.scrollY > maxScroll) {
      this.scrollY = maxScroll;
    }
  }

  private handleResize = () => {
    this.rows = process.stdout.rows || 24;
    this.cols = process.stdout.columns || 80;
    this.updateRenderLines();
    this.draw();
  };

  private handleInput = (data: string) => {
    const key = data.toString();

    // Ctrl+C (ETX) or q
    if (key === "\u0003" || key === "q") {
      this.exit();
      return;
    }

    const viewportHeight = this.rows - 1;
    const maxScroll = Math.max(0, this.renderLines.length - viewportHeight);

    // Navigation keys
    if (key === "j" || key === "\u001b[B" || key === "\u001bOB") { // Down
      this.scrollY = Math.min(this.scrollY + 1, maxScroll);
    } else if (key === "k" || key === "\u001b[A" || key === "\u001bOA") { // Up
      this.scrollY = Math.max(this.scrollY - 1, 0);
    } else if (key === " " || key === "f" || key === "\u001b[6~") { // Page Down
      this.scrollY = Math.min(this.scrollY + viewportHeight, maxScroll);
    } else if (key === "b" || key === "\u001b[5~") { // Page Up
      this.scrollY = Math.max(this.scrollY - viewportHeight, 0);
    } else if (key === "g") {
      this.scrollY = 0;
    } else if (key === "G") {
      this.scrollY = maxScroll;
    }

    this.draw();
  };

  private draw() {
    const viewportHeight = this.rows - 1;
    const visibleLines = this.renderLines.slice(this.scrollY, this.scrollY + viewportHeight);
    
    // Build the frame buffer
    // \x1b[?25l : Hide cursor
    // \x1b[2J   : Clear entire screen
    // \x1b[H    : Move cursor to home (1,1)
    let output = "\x1b[?25l\x1b[2J\x1b[H";

    for (let i = 0; i < viewportHeight; i++) {
      const line = visibleLines[i];
      if (line) {
        output += this.formatLine(line);
      }
      // Add newline unless it's the last line of viewport
      if (i < viewportHeight - 1) {
        output += "\n";
      }
    }

    // Status bar at the very bottom
    output += `\x1b[${this.rows};1H\x1b[7m ${`Node Manual Pages: ${this.topic} (q to exit)`.padEnd(this.cols - 1)}\x1b[0m`;

    process.stdout.write(output);
  }

  private formatLine(line: RenderLine): string {
    let output = "";
    for (const s of line.segments) {
      if (s.bold) output += "\x1b[1m";
      if (s.dim) output += "\x1b[2m";
      if (s.italic) output += "\x1b[3m";
      output += s.text;
      output += "\x1b[0m"; // Always reset after segment
    }
    return output;
  }

  private exit() {
    // Cleanup listeners
    process.stdout.off("resize", this.handleResize);
    process.stdin.off("data", this.handleInput);
    
    // Restore terminal state
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
    process.stdout.write("\x1b[?25h"); // Show cursor
    
    this.resolveExit?.();
  }
}
