// Search highlighter
export function searchHighlighter(){
    const searchForm = document.querySelector('.search');

    if (!searchForm) {
        console.error('Search form not found.');
        return;
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        document.querySelectorAll('.highlight').forEach(function(el) {
            var parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        var searchKey = this.q.value.trim();
        if (!searchKey) {
            console.warn('Search input is empty.');
            return;
        }

        var regex = new RegExp('(' + searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

        function walk(node) {
            if (node.nodeType === 3) { // Text node
                var match = node.nodeValue.match(regex);
                if (match) {
                    var span = document.createElement('span');
                    span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight">$1</mark>');
                    node.replaceWith.apply(node, span.childNodes);
                }
            }
            else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'FORM') {
                Array.from(node.childNodes).forEach(walk); //reihenfolge bleibt gleich (wegen array (kopie))
            }
        }

        walk(document.body);
    });

}
