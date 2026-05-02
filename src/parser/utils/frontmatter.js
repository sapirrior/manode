export function skipFrontmatter(lines) {
  if (lines[0] === "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "---") return i + 1;
    }
  }
  return 0;
}
