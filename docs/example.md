---
title: Complex Test Document
type: manual
author: manode
---

# Complex Test Document

<!-- This is an HTML comment that should be hidden -->

This is a **complex** test document to verify the *manual rendering engine*. It covers various Markdown features and edge cases.

---

## Typography & Inline Styles

You can combine styles like ***bold-italic***, **bold**, *italic*, and `inline code`.

Long words should wrap correctly: ThisIsAVeryLongWordThatShouldEventuallyBeBrokenByTheLayoutEngineBecauseItExceedsTheTerminalWidthAtSomePoint.

*Escaping test*: \*This should not be italic\* and \[this should not be a link\].

~~Strikethrough test~~ (may render as dim).

## Links

Check out the [Node.js Documentation](https://nodejs.org/api) for more info.

## Blockquotes

> This is a blockquote.
> It should be indented and have a vertical bar on the left.
> > Nested blockquotes are not explicitly supported by the current parser, but let's see how it looks.

## Lists

### Unordered List
*   Item 1
*   Item 2 with **bold** text
*   A very long list item that should wrap correctly to the next line while maintaining its indentation and bullet point alignment.
    This is a second line of the same list item, it should stay indented.

### Ordered List (Numbered)
1.  First item
2.  Second item
3.  Third item

## Code Blocks

```typescript
function testManualRendering() {
  const message = "Hello, Manual Pager!";
  console.log(message);
}
```

    This is an indented code block (4 spaces).
    It should be treated just like a fenced code block.

## Horizontal Rules

Three dashes:
---
Three stars:
***
Three underscores:
___

## Layout Stability

Empty lines (spacers) should be preserved to maintain readability.

The status bar should remain at the bottom of the terminal regardless of document length.

### Final Check
The end of the document.
