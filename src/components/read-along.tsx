import { Component, Ref, RenderableProps } from "preact";

export function ReadAlong({
  text,
  highlight,
}: {
  text: string;
  highlight?: { start: number; length: number };
  ref?: Ref<Component>;
}) {
  return (
    <div class="read-along">
      <div class="characters">{renderBody(text, highlight)}</div>
    </div>
  );
}

// Get around safari mobile clearing selection on click
const SELECTION_LAG = 100;
let currentSelectionRange: undefined | Range;
{
  let handle: undefined | number;

  document.addEventListener("selectionchange", () => {
    const newSelection = document.getSelection();
    const newSelectionRange =
      newSelection && newSelection.rangeCount > 0
        ? newSelection.getRangeAt(0)
        : undefined;
    clearTimeout(handle);
    handle = setTimeout(() => {
      currentSelectionRange = newSelectionRange;
    }, SELECTION_LAG);
  });
}

export function readAlongSelection(
  root: HTMLElement,
): undefined | { start: number; length: number } {
  const range = currentSelectionRange;
  if (root && range) {
    if (
      root.contains(range.startContainer) &&
      root.contains(range.endContainer)
    ) {
      // Need to walk forwards and count chars
      let start = range.startOffset;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
      while (walker.nextNode()) {
        if (walker.currentNode === range.startContainer) break;
        if (walker.currentNode instanceof Text)
          start += walker.currentNode.data.length;
      }
      const length = range.toString().length;
      if (length > 0) return { start, length };
    }
  }
}

function renderBody(
  text: string,
  highlight?: { start: number; length: number },
) {
  if (highlight) {
    const leftText = text.substring(0, highlight.start);
    const midText = text.substring(
      highlight.start,
      highlight.start + highlight.length,
    );
    const rightText = text.substring(highlight.start + highlight.length);
    return (
      <>
        {leftText}
        <span class="highlight">{midText}</span>
        {rightText}
      </>
    );
  } else {
    return text;
  }
}
