export function setupShowHideToggle(): void {
  const showHideBtn = document.querySelector<HTMLButtonElement>('.show-hide');
  const commentWrapper =
    document.querySelector<HTMLElement>('.comment-wrapper');

  if (showHideBtn === null || commentWrapper === null) {
    console.error('Comment toggle elements not found.');
    return;
  }

  commentWrapper.hidden = true;

  showHideBtn.addEventListener('click', (): void => {
    const isHidden: boolean | 'until-found' = commentWrapper.hidden;

    commentWrapper.hidden = isHidden === true;
    showHideBtn.textContent =
      isHidden === true ? 'Hide comment' : 'Show comment';
  });
}

// Comment form stuff
export function setupCommentForm(): void {
  const form = document.querySelector<HTMLFormElement>('.comment-form');
  const nameField = document.querySelector<HTMLInputElement>('#name');
  const commentField = document.querySelector<HTMLTextAreaElement>('#comment');
  const list = document.querySelector<HTMLUListElement>('.comment-container');

  if (
    form === null ||
    nameField === null ||
    commentField === null ||
    list === null
  ) {
    console.error('Comment form elements not found.');
    return;
  }

  form.addEventListener('submit', (e: SubmitEvent): void => {
    e.preventDefault();

    const nameValue: string = nameField.value.trim();
    const commentValue: string = commentField.value.trim();

    if (nameValue === '' || commentValue === '') {
      return;
    }

    const listItem: HTMLLIElement = document.createElement('li');
    const namePara: HTMLParagraphElement = document.createElement('p');
    const commentPara: HTMLParagraphElement = document.createElement('p');

    namePara.textContent = nameValue;
    commentPara.textContent = commentValue;

    listItem.appendChild(namePara);
    listItem.appendChild(commentPara);
    list.appendChild(listItem);

    nameField.value = '';
    commentField.value = '';
  });
}
