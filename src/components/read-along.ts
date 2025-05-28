export class ReadAlong extends HTMLElement {
  static get observedAttributes() {
    return ["text-content", "range-start", "range-end"];
  }

  connectedCallback() {
    this.refreshText();
  }

  attributeChangedCallback(name: string) {
    if (name === "text-content") this.refreshText();

    if (name === "range-start" || name === "range-end") this.refreshPosition();
  }

  getSelectionOffset(range: Range): undefined | number {
    const parent = firstParentElement(range.startContainer);
    if (parent instanceof HTMLElement && this.contains(parent)) {
      const index = parent.getAttribute("data-index");
      return index === null ? undefined : parseInt(index) + range.startOffset;
    }
  }

  refreshText() {
    this.innerHTML = "";

    const textContent = this.getAttribute("text-content") || "";
    Array.from(textContent).forEach((char, idx) => {
      const span = document.createElement("span");
      span.setAttribute("data-index", idx.toString());
      span.innerText = char;
      this.appendChild(span);
    });

    this.refreshPosition();
  }

  refreshPosition() {
    const rangeStart = this.getAttribute("range-start");
    const rangeEnd = this.getAttribute("range-end");

    for (const elem of this.children) {
      const index = elem.getAttribute("data-index");
      if (
        rangeStart !== null &&
        rangeEnd !== null &&
        index !== null &&
        parseInt(index) >= parseInt(rangeStart) &&
        parseInt(index) <= parseInt(rangeEnd)
      )
        elem.className = "active";
      else elem.className = "";
    }
  }
}

function firstParentElement(node: Node): Element {
  if (node instanceof Element) return node;
  if (node.parentElement) return node.parentElement;
  throw new Error(`Node did not have an element parent`);
}

self.customElements.define("read-along", ReadAlong);
