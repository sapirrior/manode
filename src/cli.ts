#!/usr/bin/env node
import resolveDoc from "./utils/resolveDoc.js"
import loadDoc from "./utils/loadDoc.js";
import renderDoc from "./utils/renderDoc.js"

// Find the topic
const topic = process.argv[2];

if (!topic) {
  console.log("USAGE manode <module>");
  console.log("EXAMPLE manode help");
  process.exit(0);
}

try {
  const filePath = resolveDoc(topic);
  const content = loadDoc(filePath);
  await renderDoc(content, topic);
} catch (error) {
  console.log("ERROR failed to load doc");
  console.log(`ERROR ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
