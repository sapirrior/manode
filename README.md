# manode

mandoc for Node.js - A terminal-based manual pager for documentation.

Welcome to manode. This tool provides a cozy environment for reading Node.js API documentation right in your terminal. By utilizing the terminal's alternate screen buffer and a clean monochrome interface, it offers a focused reading experience that mirrors the classic man(1) utility.

## Functional Highlights

*   **Zero-Dependency TUI**: Built using native Node.js APIs and standard ANSI escape sequences. This means no external UI libraries to worry about.
*   **Alternate Buffer Support**: manode operates in a separate terminal layer. Once you exit, your command history stays exactly how you left it.
*   **Modular Architecture**: Every source file is kept short and focused, making the codebase straightforward to navigate.
*   **Monochrome Typography**: The interface uses bold, dim, and italic styles to help you find what you need without visual clutter.
*   **Smart Layout**: A custom engine handles word-wrapping and formatting so your documentation displays correctly at any terminal size.

## Installation

To install manode globally on your system:

```bash
npm install -g manode-docs
```

## Usage

Ready to start exploring? Just pass a Node.js module name as an argument:

```bash
manode fs
manode path
```

If you ever need a reminder of how things work:

```bash
manode help
```

### Commands

manode supports built-in commands prefixed with a colon:

*   `manode :list` - Displays all available documentation modules.
*   `manode help list` - An alias to quickly see the module list.

### Refreshing Documentation

If you have cloned the repository for development, or if you wish to update your local documentation library to the latest version, you can run:

```bash
npm run sync
```

Note that when installing via `npm install -g`, the core documentation is already included and ready to use.

## Navigation

Moving around is simple and intuitive:

| Key | Action |
| :--- | :--- |
| **j** / **Down Arrow** | Take a small step down (one line). |
| **k** / **Up Arrow** | Hop back up (one line). |
| **Space** / **f** / **PageDown** | Zoom down a whole page. |
| **b** / **PageUp** | Leap back up a page. |
| **g** | Return to the beginning. |
| **G** | Jump to the end. |
| **q** | Wave goodbye and exit. |

## Contributing

manode uses a modern ES Module architecture. There are no build steps or transpilation required, so you can start tinkering immediately.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sapirrior/manode.git
    cd manode
    ```
2.  **Run directly**:
    ```bash
    node src/cli.js help
    ```

Please refer to CONTRIBUTING.md for our modular standards and language guidelines. We look forward to seeing your ideas.

---

**Author**: manode  
**License**: MIT
