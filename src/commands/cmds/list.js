import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, "../../../docs");

export async function execute() {
  try {
    const files = fs.readdirSync(DOCS_DIR)
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""));

    if (files.length === 0) {
      process.stdout.write("info: no modules found\n");
      return;
    }

    process.stdout.write("available modules:\n");
    files.sort();
    process.stdout.write("  " + files.join(", ") + "\n");
    process.stdout.write(`total: ${files.length} modules found\n`);
  } catch (error) {
    process.stderr.write(`error: listing failure - ${error.message}\n`);
  }
}
