import { REGEX } from "./constants.js";
import { skipFrontmatter } from "./utils/frontmatter.js";
import { handleHtmlComments } from "./utils/htmlComments.js";
import { parseTable } from "./elements/table.js";

export function parse(content) {
  if (typeof content !== "string") return [];
  const lines = content.split(/\r?\n/), blocks = [];
  let inCode = false, inHtmlComment = false, lang = "", buffer = [];

  for (let i = skipFrontmatter(lines); i < lines.length; i++) {
    const line = lines[i], t = line.trim();
    if (!inCode) {
      const { shouldSkip, inHtmlComment: newIn } = handleHtmlComments(line, inHtmlComment);
      inHtmlComment = newIn;
      if (shouldSkip) continue;
    }

    if (t.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", language: lang, code: buffer.join("\n") });
        inCode = false; buffer = []; lang = "";
      } else {
        inCode = true;
        const m = t.match(REGEX.CODE_FENCE);
        lang = m ? m[1] : "";
      }
      continue;
    }

    if (inCode) { buffer.push(line); continue; }
    if (!t) { blocks.push({ type: "spacer" }); continue; }

    if (REGEX.INDENTED_CODE.test(line) && !/^(?:\s*[*+-]|\s*\d+\.)/.test(line)) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "code" && !lang) last.code += "\n" + line.slice(4);
      else blocks.push({ type: "code", language: "", code: line.slice(4) });
      continue;
    }

    if (REGEX.HR.test(t)) { blocks.push({ type: "hr" }); continue; }
    const h = t.match(REGEX.HEADING);
    if (h) { blocks.push({ type: "heading", level: h[1].length, text: h[2] }); continue; }
    if (t.startsWith("> ")) { blocks.push({ type: "blockquote", text: t.slice(2) }); continue; }

    if (t.startsWith("|")) {
      const table = parseTable(lines, i);
      if (table) {
        blocks.push({ type: "table", rows: table.rows });
        i = table.nextIndex - 1; continue;
      }
    }

    const list = t.match(REGEX.LIST), last = blocks[blocks.length - 1];
    if (list) { blocks.push({ type: "listItem", text: list[2] }); continue; }

    if (last && last.type === "listItem" && REGEX.LIST_OR_PARAGRAPH_CONT.test(line)) {
      last.text += " " + t;
    } else if (last && last.type === "paragraph") {
      last.text += " " + t;
    } else {
      blocks.push({ type: "paragraph", text: t });
    }
  }

  if (inCode) blocks.push({ type: "code", language: lang, code: buffer.join("\n") });
  return blocks;
}
