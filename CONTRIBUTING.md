# Contributing to manode

Thank you for your interest in helping out with manode. This document outlines the standards and procedures for contributing to the project.

## Code of Conduct

Maintain a respectful and objective tone in all interactions. We value clear and factual communication.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Install dependencies** (optional):
    ```bash
    npm install
  ```
4.  **Sync Documentation**:
    ```bash
    npm run sync
    ```
5.  **Run the CLI directly**:
    ```bash
    node src/cli.js help
    ```
## Standards

### Language and Tone

We follow a two-tier language policy to keep things both professional and inviting:

*   **Source Code (The Serious Part)**: Code comments and variable names must be strictly professional. Avoid casual words, slang, or any form of hyperbole. Stick to precise, technical descriptions of what the code is doing.
*   **Documentation (The Friendly Part)**: For Markdown files like README.md and CONTRIBUTING.md, we aim for a helpful and playful vibe. We want our guides to be inviting and easy to read.
*   **No Emojis**: Emojis are forbidden in all files, including code comments and documentation.
*   **No Hyperboles**: Do not use words like "best", "high-performance", "professional", "advanced", "robust", or "authentic". Stick to factual descriptions. Instead of "extremely fast", say "optimized for responsiveness".

### AI-Assisted Contributions

The use of AI models to assist in development is allowed. However, all AI-generated code or documentation must be:
*   **Human-Reviewed**: Carefully scrutinized by the contributor for logic, style, and correctness.
*   **Empirically Tested**: Verified through manual or automated testing to ensure it works correctly before a Pull Request is opened.

### Coding Style

*   **Modular Architecture**: Every source file in src/ must be strictly **under 100 lines of code**. If a file exceeds this limit, it must be split into smaller, focused modules.
*   **Plain JavaScript**: Use ES Modules (import/export). No TypeScript and no build steps.
*   **Naming Convention**: Always use camelCase for variables, function names, and properties. Use PascalCase for classes.
*   **Zero Dependencies**: Avoid adding new dependencies. The core application relies on native Node.js APIs and ANSI escape sequences.
*   **Comments**: Provide descriptive comments for logic that is not immediately obvious.

### Commit Messages

Commit messages must be descriptive and follow a consistent format. Use the imperative mood (e.g., "Add feature" instead of "Added feature").

Format: <type>: <description>

Types:
*   feat: A new feature
*   fix: A bug fix
*   docs: Documentation changes
*   refactor: A code change that neither fixes a bug nor adds a feature
*   test: Adding or correcting tests

Example: fix: correct table border alignment in narrow terminals

## Pull Request Process

1.  Create a new branch for your changes.
2.  Ensure your code follows the 100-line limit and language standards.
3.  Test your changes manually to ensure everything works as expected.
4.  Update the documentation if you are adding or changing features.
5.  Submit a pull request with a clear description of your work.

Thank you for helping improve manode.
