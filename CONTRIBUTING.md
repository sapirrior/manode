# Contributing to manode

Thank you for your interest in contributing to `manode`. This document outlines the standards and procedures for contributing to this project.

## Code of Conduct

Maintain a respectful and objective tone in all interactions. Avoid exaggerated or subjective language when describing features or performance.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Install dependencies**:
    ```bash
    npm install
  ```
4.  **Build the project**:
    ```bash
    npm run build
  ```

## Standards

### Language and Tone

*   **No Hyperboles**: Do not use words like "best", "high-performance", "professional", "advanced", "robust", or "authentic" in documentation or code comments. Stick to factual descriptions of what the code does.
*   **Objective Perspective**: Focus on utility and clarity.

### AI-Assisted Contributions

The use of AI models to assist in development is allowed and encouraged. However, all AI-generated code or documentation must be:
*   **Human-Reviewed**: Carefully scrutinized by the contributor for logic, style, and correctness.
*   **Empirically Tested**: Verified through manual or automated testing to ensure it works as intended within the project context before a Pull Request is opened.

### Coding Style

*   **Naming Convention**: Always use `camelCase` for variables, function names, and properties.
*   **Components**: Use `PascalCase` for React components.
*   **Comments**: Provide descriptive comments for complex logic. Use standard JSDoc format for functions where appropriate. Comments should explain *why* something is done, not just *what* is being done if it is already clear from the code.
*   **TypeScript**: Ensure all new code is properly typed. Avoid using `any`.

### Commit Messages

Commit messages must be descriptive and follow a consistent format. Use the imperative mood (e.g., "Add feature" instead of "Added feature").

Format: `<type>: <description>`

Types:
*   `feat`: A new feature
*   `fix`: A bug fix
*   `docs`: Documentation changes
*   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
*   `refactor`: A code change that neither fixes a bug nor adds a feature
*   `test`: Adding missing tests or correcting existing tests
*   `chore`: Changes to the build process or auxiliary tools and libraries

Example: `feat: add support for horizontal rules in parser`

## Pull Request Process

1.  Create a new branch for your changes.
2.  Ensure your code follows the style guidelines.
3.  Build the project to ensure no regressions were introduced.
4.  Update the documentation if you are adding or changing features.
5.  Submit a pull request with a clear description of the changes and the problem they solve.

Thank you for helping improve `manode`.
