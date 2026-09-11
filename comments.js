/* Show/hide comments toggle
ES module -> wrap code with function and use export indicator
*/
export function setupShowHideToggle() {
    const showHideBtn = document.querySelector('.show-hide'); //var zu const
    const commentWrapper = document.querySelector('.comment-wrapper');

    commentWrapper.hidden = true;

    showHideBtn.addEventListener('click', function () { //onClick ginge auch i guess
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

    form.addEventListener('submit', function(e)  { //geändert
        e.preventDefault();

        const nameValue = nameField.value;
        const commentValue = commentField.value;

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
