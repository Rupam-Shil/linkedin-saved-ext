const SavedPostsButton = () => {
	const button = document.createElement('button');
	button.id = 'linkedin-saved-posts-button';
	button.textContent = 'Saved Posts';

	button.style.cssText = `
    background: #0a66c2;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-left: auto;
    margin-right: 16px;
	text-transform: capitalize;
  `;

	button.addEventListener('click', () => {
		window.open('https://www.linkedin.com/feed/saved/', '_self');
	});

	return button;
};

const injectButton = () => {
	const button = document.querySelector('#linkedin-saved-posts-button');
	if (button) {
		button.remove();
	}
	const header = document.querySelector('.global-nav__content');
	if (header) {
		const button = SavedPostsButton();
		header.appendChild(button);
	}
};

injectButton();

// Re-inject the button when the URL changes
chrome.runtime.onMessage.addListener((request) => {
	if (request.message === 'URL_CHANGED') {
		injectButton();
	}
});
