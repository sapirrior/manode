import fs from "node:fs";

export default function loadDoc(filePath) {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new Error("invalid file path");
  }
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    throw new Error("failed to read file content");
  }
}
