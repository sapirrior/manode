import { Pager } from "../pager/Pager.js";

export default async function renderDoc(content, topic) {
  process.stdout.write("\x1b[?1049h");
  try {
    const pager = new Pager(content, topic);
    await pager.start();
  } finally {
    process.stdout.write("\x1b[?1049l");
  }
}
