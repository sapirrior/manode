import fs from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, "../../docs");
const VALID_TOPIC = /^[a-zA-Z0-9_-]+$/;

export default function resolveDoc(topic: string): string {
  const cleanTopic = topic.trim();

  if (!cleanTopic) {
    throw new Error("Invalid topic");
  }

  if (!VALID_TOPIC.test(cleanTopic)) {
    throw new Error("Invalid topic format");
  }

  const filePath = path.resolve(DOCS_DIR, `${cleanTopic}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Doc not found: ${cleanTopic}`);
  }

  return filePath;
}
