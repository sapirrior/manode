/**
 * Parses a string for inline Markdown styles like bold, italic, and inline code.
 * Returns an array of styled segments.
 */
export function parseInline(text) {
  const cleanText = text.replace(/<[^>]*>/g, "");
  const segments = [];
  const regex = /(\\.)|(\[.*?\]\(.*?\))|(~~.*?~~)|(\*\*\*|___|\*\*|__|(?<!\*)\*(?!\*)|(?<!_)_(?!_)|`)(.*?)\4|([^*_`\\~\[<]+|[*_`\\~\[<])/g;
  let match;

  while ((match = regex.exec(cleanText)) !== null) {
    const [full, escape, link, strike, marker, inner, plain] = match;
    if (escape) {
      segments.push({ text: escape.slice(1) });
    } else if (link) {
      const linkMatch = link.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        segments.push({ text: linkMatch[1] });
        segments.push({ text: ` (${linkMatch[2]})`, dim: true });
      } else {
        segments.push({ text: link });
      }
    } else if (strike) {
      segments.push({ text: strike.slice(2, -2), dim: true });
    } else if (marker) {
      const segment = { text: inner };
      if (marker === "***" || marker === "___") {
        segment.bold = true;
        segment.italic = true;
      } else if (marker === "**" || marker === "__") {
        segment.bold = true;
      } else if (marker === "*" || marker === "_") {
        segment.italic = true;
      } else if (marker === "`") {
        segment.dim = true;
      }
      segments.push(segment);
    } else if (plain) {
      segments.push({ text: plain });
    }
  }
  if (segments.length === 0 && cleanText.length > 0) {
    segments.push({ text: cleanText });
  }
  return segments;
}
