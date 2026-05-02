import { ACTIONS, KEY_MAP } from "./constants.js";

export function getActions(data) {
  const input = data.toString();
  const actions = [];
  const mouseRegex = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
  let match;
  while ((match = mouseRegex.exec(input)) !== null) {
    const cb = parseInt(match[1], 10);
    if (cb === 64) actions.push(ACTIONS.UP);
    if (cb === 65) actions.push(ACTIONS.DOWN);
  }
  const tokens = input.replace(mouseRegex, "").split(/(\x1b\[[0-9;]*[a-zA-Z~]|\x1bO[a-zA-Z])/);
  for (const token of tokens) {
    if (!token) continue;
    if (KEY_MAP[token]) {
      actions.push(KEY_MAP[token]);
    } else {
      for (const char of token) {
        if (KEY_MAP[char]) actions.push(KEY_MAP[char]);
      }
    }
  }
  return actions;
}
