# manode

mandoc for Node.js - A terminal-based manual pager for documentation.

`manode` provides a localized environment for reading Node.js API documentation. By utilizing the terminal's alternate screen buffer and a monochrome interface, it offers a focused reading experience that mirrors the classic `man(1)` utility.

## Functional Highlights

*   **Alternate Buffer Support**: The application operates in a separate terminal layer, ensuring your command history remains clear after you exit the pager.
*   **Monochrome Typography**: The interface uses bold and dim text segments to convey hierarchy, maintaining a distraction-free aesthetic.
*   **Segment-Aware Layout**: A custom word-wrapping engine processes inline styles—including bold, italics, and code markers—while preserving formatting across line breaks.
*   **Built with Ink**: The application leverages React components to manage terminal UI state and keyboard interactions.

## Installation

To install `manode` globally on your system:

```bash
npm install -g manode
```

Once installed, you can run `manode` from any directory.

## Usage

Pass a Node.js module name as an argument to view its documentation:

```bash
manode fs
manode path
```

To view the internal guide and navigation keys:

```bash
manode help
```

## Navigation

The pager responds to standard terminal keybindings:

| Key | Action |
| :--- | :--- |
| **j** / **Down Arrow** | Scroll down one line |
| **k** / **Up Arrow** | Scroll up one line |
| **Space** / **f** | Scroll down one page |
| **b** | Scroll up one page |
| **g** | Jump to the beginning |
| **G** | Jump to the end |
| **q** | Exit the pager |

## Contributing

If you wish to contribute or build from source:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sapirrior/manode.git
    cd manode
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Build and link**:
    ```bash
    npm run build
    npm link
    ```

Please refer to `CONTRIBUTING.md` for our contribution standards.

---

**Author**: manode  
**License**: MIT
