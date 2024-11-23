chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com')) {
		chrome.tabs.sendMessage(tabId, { message: 'URL_CHANGED' });
	}
});
