# manode(1) - Node.js API Documentation Pager

## SYNOPSIS
**manode** [TOPIC]

## DESCRIPTION
**manode** is a terminal-based pager for viewing Node.js API documentation. It provides a classic manual-page experience with full-screen rendering, alternate buffer support, and keyboard navigation.

## NAVIGATION
The pager uses standard keybindings inspired by **less(1)** and **man(1)**:

*   **j**, **Down Arrow**
    Scroll down by one line.
*   **k**, **Up Arrow**
    Scroll up by one line.
*   **Space**, **f**, **Page Down**
    Scroll down by one full page.
*   **b**, **Page Up**
    Scroll up by one full page.
*   **g**
    Jump to the beginning (top) of the document.
*   **G**
    Jump to the end (bottom) of the document.
*   **q**
    Quit the pager and return to the terminal.

## EXAMPLES
*   **manode fs**
    View the File System module documentation.
*   **manode path**
    View the Path module documentation.
*   **manode help**
    Display this help page.

## ARCHITECTURE
The tool is built using **Node.js**, **TypeScript**, and **Ink**. It parses local Markdown files located in the `docs/` directory.

## FILES
*   **docs/**
    Directory containing the Markdown source files for the documentation.
*   **scripts/sync-docs.js**
    Script used to synchronize the local documentation files with the official Node.js repository.

## BUGS
Reports bugs at: <https://github.com/sapirrior/manode>

## AUTHOR
manode
