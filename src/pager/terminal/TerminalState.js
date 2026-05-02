export class TerminalState {
  static setup() {
    process.stdout.write("\x1b[?1049h\x1b[?25l\x1b[?1000h\x1b[?1006h");
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
  }

  static restore() {
    process.stdout.write("\x1b[?1000l\x1b[?1006l\x1b[?1049l\x1b[?25h");
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  }
}
