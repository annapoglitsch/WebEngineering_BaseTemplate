// Search highlighter


function clearHighlights(){
    document.querySelectorAll('.highlight').forEach((el) => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
}

function highlightMatches(root, regex){
    Array.from(root.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const match = node.nodeValue.match(regex);
            if (match) {
                const span = document.createElement('span');
                span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight">$1</mark>');
                node.replaceWith(...span.childNodes);
            }
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            !['SCRIPT', 'STYLE', 'FORM'].includes(node.tagName)
        ) {
            highlightMatches(node, regex);
        }
    });
}

export function searchHighlighter(){
    const searchForm = document.querySelector('.search');

    if (!searchForm) {
        console.error('Search form not found.');
        return;
    }

    searchForm.addEventListener('submit',  e => {
        e.preventDefault();

        clearHighlights();

        const searchKey = searchForm.querySelector('[name="q"]').value.trim();

        if (!searchKey) {
            console.warn('Search input is empty.');
            return;
        }

        const regex = new RegExp('(' + searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

        highlightMatches(document.body, regex)
    });
}
