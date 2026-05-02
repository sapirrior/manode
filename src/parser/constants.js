export const REGEX = {
  HR: /^(?:[-*_]\s*){3,}$/,
  HEADING: /^(#{1,6})\s+(.*)$/,
  LIST: /^(\*|-|\+|\d+\.)\s+(.*)$/,
  CODE_FENCE: /^```(\w*)/,
  INDENTED_CODE: /^ {4}/,
  LIST_OR_PARAGRAPH_CONT: /^ {4}/
};
