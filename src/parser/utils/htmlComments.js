export function handleHtmlComments(line, inHtmlComment) {
  const t = line.trim();
  let currentInHtmlComment = inHtmlComment;
  if (t.startsWith("<!--")) currentInHtmlComment = true;
  const shouldSkip = currentInHtmlComment;
  if (currentInHtmlComment && t.includes("-->")) currentInHtmlComment = false;
  return { shouldSkip, inHtmlComment: currentInHtmlComment };
}
