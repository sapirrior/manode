export const ACTIONS = {
  EXIT: "EXIT",
  DOWN: "DOWN",
  UP: "UP",
  PAGE_DOWN: "PAGE_DOWN",
  PAGE_UP: "PAGE_UP",
  TOP: "TOP",
  BOTTOM: "BOTTOM"
};

const KEY_MAP = {
  "\u0003": ACTIONS.EXIT,
  "q": ACTIONS.EXIT,
  "j": ACTIONS.DOWN,
  "\u001b[B": ACTIONS.DOWN,
  "\u001bOB": ACTIONS.DOWN,
  "k": ACTIONS.UP,
  "\u001b[A": ACTIONS.UP,
  "\u001bOA": ACTIONS.UP,
  " ": ACTIONS.PAGE_DOWN,
  "f": ACTIONS.PAGE_DOWN,
  "\u001b[6~": ACTIONS.PAGE_DOWN,
  "b": ACTIONS.PAGE_UP,
  "\u001b[5~": ACTIONS.PAGE_UP,
  "g": ACTIONS.TOP,
  "G": ACTIONS.BOTTOM
};

export function getActions(data) {
  const input = data.toString();
  const actions = [];
  
  // Handle mouse SGR sequences: \x1b[<Cb;Px;PyM
  const mouseRegex = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;
  let match;
  let lastIndex = 0;

  while ((match = mouseRegex.exec(input)) !== null) {
    const cb = parseInt(match[1], 10);
    if (cb === 64) actions.push(ACTIONS.UP);
    if (cb === 65) actions.push(ACTIONS.DOWN);
    // We ignore mouse moves/clicks for now
  }

  // Handle standard keys and ANSI sequences by splitting/tokenizing
  // This is a simple tokenizer that looks for \x1b... sequences or single chars
  const tokens = input.replace(mouseRegex, "").split(/(\x1b\[[0-9;]*[a-zA-Z~]|\x1bO[a-zA-Z])/);
  
  for (const token of tokens) {
    if (!token) continue;
    if (KEY_MAP[token]) {
      actions.push(KEY_MAP[token]);
    } else {
      // Handle single characters that might be concatenated
      for (const char of token) {
        if (KEY_MAP[char]) actions.push(KEY_MAP[char]);
      }
    }
  }

  return actions;
}
