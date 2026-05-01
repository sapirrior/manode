import fs from "node:fs";

export default function loadDoc(filePath: string): string {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new Error("Invalid file path");
  }

  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    throw new Error(`Failed to read doc: ${filePath}`);
  }
}
