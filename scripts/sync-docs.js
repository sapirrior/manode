import { mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = "https://api.github.com/repos/nodejs/node/contents/doc/api";
const OUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs");
const USER_AGENT = "manode-sync";
const TIMEOUT_MS = 15_000;
const RETRIES = 3;

async function fetchWithRetry(url, options = {}, retries = RETRIES) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/vnd.github+json",
          ...(options.headers ?? {})
        }
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return res;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }
    }
  }

  throw lastError;
}

async function fetchJson(url) {
  const res = await fetchWithRetry(url);
  return res.json();
}

async function fetchText(url) {
  const res = await fetchWithRetry(url);
  return res.text();
}

async function writeAtomic(filePath, content) {
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, content, "utf8");
  await rename(tempPath, filePath);
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await fetchJson(API_URL);

  if (!Array.isArray(entries)) {
    throw new Error("GitHub API returned an unexpected response.");
  }

  const mdFiles = entries.filter(e => e && e.type === "file" && e.name.endsWith(".md") && e.download_url);

  for (const file of mdFiles) {
    const outPath = path.join(OUT_DIR, file.name);
    try {
      console.log(`sync: ${file.name}`);
      const content = await fetchText(file.download_url);
      await writeAtomic(outPath, content);
    } catch (error) {
      console.error(`error: ${file.name} - ${error.message}`);
    }
  }
  console.log("info: sync complete");
}

run().catch(error => {
  console.error(`error: fatal - ${error.message}`);
  process.exitCode = 1;
});