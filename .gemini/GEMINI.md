# GEMINI.md - manode

mandoc for Node.js - A terminal-based manual pager designed to view Node.js API documentation.
 It features a React/Ink rendering engine with Markdown parsing and a full-screen pager.

## Project Overview

- **Name:** manode
- **Purpose:** Terminal-based Node.js API documentation viewer.
- **Technologies:** 
  - **Runtime:** Node.js (ESM)
  - **Language:** TypeScript
  - **UI Framework:** [Ink](https://github.com/vadimdemedes/ink) (React for CLI)
  - **Documentation Source:** Official Node.js API docs (GitHub)

## Core Architecture

The rendering engine is modularized:

- `src/cli.ts`: The entry point. Handles argument parsing and orchestrates the doc-loading lifecycle.
- `src/utils/resolveDoc.ts`: Resolves documentation topics (e.g., `fs`, `path`, `help`) to local Markdown paths in `docs/`.
- `src/utils/loadDoc.ts`: Handles file system I/O for reading Markdown content.
- `src/utils/renderDoc.tsx`: Manages terminal state transitions (alternate screen buffer `\x1b[?1049h`, screen clearing `\x1b[2J`, and cursor homing).
- `src/utils/parser.ts`: A regex-based Markdown block parser. Handles headings (1-6), list markers (*, -, +, 1.), horizontal rules, and metadata-aware code blocks.
- `src/utils/layout.ts`: The layout engine. Features an inline parser for styles (**bold**, *italic*, `code`) and a word-wrapping algorithm that preserves formatting across line breaks.
- `src/utils/Pager.tsx`: The main React application. Manages scrolling state, terminal dimension tracking, and interactive keyboard navigation.

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Commands
- **Install Dependencies:** `npm install`
- **Build Project:** `npm run build` (Compiles TS to `dist/`)
- **Sync Documentation:** `npm run sync` (Downloads latest Node.js docs)
- **Run CLI:** `manode <topic>` (Example: `manode fs`)

## Development Conventions

- **Global Installation:** The package is designed for global installation via `npm install -g manode-docs`. Developers can also use `npm link` or `npm install -g .` for local testing. It uses the `preferGlobal` flag to signal its intended use as a CLI utility.
- **Modules:** Strict ESM. Always use `.js` extensions in imports (e.g., `import { x } from "./y.js"`).
- **Monochrome Aesthetic:** To match `man(1)`, the UI is strictly monochrome. Use `bold` for headings and `dim` for blockquotes, code metadata, and secondary segments. Avoid terminal colors.
- **Rendering Engine:**
  - **Alternate Buffer:** Always use the alternate screen buffer to keep terminal history clean.
  - **Viewport Padding:** Always render exactly `viewportHeight` lines. Pad short documents with empty lines to force the status bar to the absolute bottom of the terminal.
  - **Stable Keys:** Use stable React keys (index-based for the fixed viewport slice) to prevent rendering lag.
- **Pager Navigation:**
  - `j` / `Down Arrow`: Scroll down one line.
  - `k` / `Up Arrow`: Scroll up one line.
  - `Space` / `f` / `Page Down`: Scroll down one page.
  - `b` / `Page Up`: Scroll up one page.
  - `g`: Jump to top.
  - `G`: Jump to bottom.
  - `q`: Quit pager.

## Future Improvements (TODO)
- [ ] Add a search feature (`/`) with regex support.
- [ ] Implement support for Markdown tables.
- [ ] Add support for clickable/navigable links between documentation topics.
- [ ] Improve error handling and retry logic in the `sync` script.
