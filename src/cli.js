#!/usr/bin/env node
import resolveDoc from "./core/resolve.js"
import loadDoc from "./core/load.js";
import renderDoc from "./core/render.js"
import { handleCommand } from "./commands/cmdHandler.js";

const topic = process.argv[2];
const subTopic = process.argv[3];

if (!topic) {
  process.stderr.write("usage: manode <module>\n");
  process.stderr.write("   or: manode help\n");
  process.exit(129);
}

if (topic === "help" && subTopic === "list") {
  await handleCommand(":list");
  process.exit(0);
}

if (topic.startsWith(":")) {
  await handleCommand(topic);
  process.exit(0);
}

try {
  const filePath = resolveDoc(topic);
  const content = loadDoc(filePath);
  await renderDoc(content, topic);
} catch (error) {
  process.stderr.write(`fatal: ${error.message}\n`);
  process.exit(128);
}
