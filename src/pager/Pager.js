import { parse } from "../parser/parse.js";
import { getRenderLines } from "../layout/renderer.js";
import { ACTIONS } from "./input/constants.js";
import { getActions } from "./input/InputHandler.js";
import { TerminalState } from "./terminal/TerminalState.js";
import { Renderer } from "./Renderer.js";

export class Pager {
  scrollY = 0; rows = 24; cols = 80; blocks; renderLines = []; topic; resolveExit;

  constructor(content, topic) {
    this.topic = topic;
    this.blocks = parse(content);
    this.refreshDimensions();
    this.updateRenderLines();
  }

  refreshDimensions() {
    this.rows = process.stdout.rows || 24;
    this.cols = process.stdout.columns || 80;
  }

  async start() {
    TerminalState.setup();
    this.draw();
    process.stdout.on("resize", this.handleResize);
    process.stdin.on("data", this.handleInput);
    return new Promise((resolve) => { this.resolveExit = resolve; });
  }

  updateRenderLines() {
    this.renderLines = getRenderLines(this.blocks, this.cols);
    const maxScroll = Math.max(0, this.renderLines.length - (this.rows - 1));
    this.scrollY = Math.min(this.scrollY, maxScroll);
  }

  handleResize = () => {
    this.refreshDimensions();
    this.updateRenderLines();
    this.draw();
  };

  handleInput = (data) => {
    const actions = getActions(data);
    if (actions.length === 0) return;
    for (const action of actions) {
      const viewportHeight = this.rows - 1;
      const maxScroll = Math.max(0, this.renderLines.length - viewportHeight);
      switch (action) {
        case ACTIONS.EXIT: return this.exit();
        case ACTIONS.DOWN: this.scrollY = Math.min(this.scrollY + 1, maxScroll); break;
        case ACTIONS.UP: this.scrollY = Math.max(this.scrollY - 1, 0); break;
        case ACTIONS.PAGE_DOWN: this.scrollY = Math.min(this.scrollY + viewportHeight, maxScroll); break;
        case ACTIONS.PAGE_UP: this.scrollY = Math.max(this.scrollY - viewportHeight, 0); break;
        case ACTIONS.TOP: this.scrollY = 0; break;
        case ACTIONS.BOTTOM: this.scrollY = maxScroll; break;
      }
    }
    this.draw();
  };

  draw() {
    Renderer.draw({
      rows: this.rows, cols: this.cols, scrollY: this.scrollY,
      renderLines: this.renderLines, topic: this.topic
    });
  }

  exit() {
    process.stdout.off("resize", this.handleResize);
    process.stdin.off("data", this.handleInput);
    TerminalState.restore();
    this.resolveExit?.();
  }
}
