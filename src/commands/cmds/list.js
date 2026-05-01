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
      console.log("info: no modules found");
      return;
    }

    console.log("available modules:");
    files.sort();
    console.log("  " + files.join(", "));
    console.log(`total: ${files.length} modules found`);
  } catch (error) {
    console.error(`error: listing failure - ${error.message}`);
  }
}
