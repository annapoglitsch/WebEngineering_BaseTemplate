/* Show/hide comments toggle
ES module -> wrap code with function and use export indicator
*/
export function setupShowHideToggle() {
    const showHideBtn = document.querySelector('.show-hide'); //var zu const
    const commentWrapper = document.querySelector('.comment-wrapper');

    if (!showHideBtn || !commentWrapper) {
        console.error('Comment toggle elements not found.');
        return;
    }

    commentWrapper.hidden = true;

    showHideBtn.addEventListener('click', () => {
        const isHidden = commentWrapper.hidden;
        commentWrapper.hidden = !isHidden;
        showHideBtn.textContent = isHidden ? 'Hide comment' : 'Show comment';
    });
}

// Comment form stuff
export function commentFormat(){
    const form = document.querySelector('.comment-form');
    const nameField = document.querySelector('#name');
    const commentField = document.querySelector('#comment');
    const list = document.querySelector('.comment-container');

    if (!form || !nameField || !commentField || !list) {
        console.error('Comment form elements not found.');
        return;
    }

    form.addEventListener('submit', (e) =>  { //geändert
        e.preventDefault();

        const nameValue = nameField.value.trim();
        const commentValue = commentField.value.trim();

        if (!nameValue || !commentValue) return; //leerer kommentar

        const listItem = document.createElement('li');
        const namePara = document.createElement('p');
        const commentPara = document.createElement('p');

        namePara.textContent = nameValue;
        commentPara.textContent = commentValue;

        //console.log(nameValue);

        list.appendChild(listItem);
        listItem.appendChild(namePara);
        listItem.appendChild(commentPara);

        nameField.value = '';
        commentField.value = '';
    });
}
