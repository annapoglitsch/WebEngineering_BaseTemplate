// Search highlighter

function clearHighlights(): void {
  document.querySelectorAll<HTMLElement>('.highlight').forEach((el) => {
    const parent = el.parentNode;
    if (!parent) {
      return;
    }
    parent.replaceChild(document.createTextNode(el.textContent ?? ''), el);
    parent.normalize();
  });
}

function highlightMatches(root: Node, regex: RegExp): void {
  Array.from(root.childNodes).forEach((node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue ?? '';
      const match = text.match(regex);
      if (match) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(
          regex,
          '<mark class="highlight">$1</mark>'
        );
        node.replaceWith(...Array.from(span.childNodes));
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT', 'STYLE', 'FORM'].includes((node as Element).tagName)
    ) {
      highlightMatches(node, regex);
    }
  });
}

export function searchHighlighter(): void {
  const searchForm = document.querySelector<HTMLFormElement>('.search');

  if (!searchForm) {
    console.error('Search form not found.');
    return;
  }

  searchForm.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    clearHighlights();

    const searchInput =
      searchForm.querySelector<HTMLInputElement>('[name="q"]');

    if (!searchInput) {
      console.error('Search input not found.');
      return;
    }
    const searchKey = searchInput.value.trim();

    if (!searchKey) {
      console.warn('Search input is empty.');
      return;
    }
    const escapedSearchKey = searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(`(${escapedSearchKey})`, 'gi');

    highlightMatches(document.body, regex);
  });
}
