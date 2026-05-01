import React from "react";
import { render } from "ink";
import { Pager } from "./Pager.js";

export default async function renderDoc(content: string, topic: string) {
  // Enter alternate buffer and clear screen
  process.stdout.write("\x1b[?1049h\x1b[2J\x1b[H");

  const { waitUntilExit } = render(<Pager content={content} topic={topic} />);
  await waitUntilExit();

  // Exit alternate buffer
  process.stdout.write("\x1b[?1049l");
}
