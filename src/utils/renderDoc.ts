import { Pager } from "./Pager.js";

/**
 * Entry point for rendering a document in the terminal.
 * Sets up the alternate buffer and starts the manual Pager.
 */
export default async function renderDoc(content: string, topic: string) {
  // Enter alternate buffer
  process.stdout.write("\x1b[?1049h");

  try {
    const pager = new Pager(content, topic);
    await pager.start();
  } finally {
    // Exit alternate buffer
    process.stdout.write("\x1b[?1049l");
  }
}
