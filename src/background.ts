chrome.runtime.onMessage.addListener((message) => {
	console.log('Message received:', message);
	if (message.action === 'add_image' && message.tabId) {
		chrome.scripting.executeScript({
			target: { tabId: message.tabId },
			func: () => {
				const img = document.createElement('img');
				img.src = 'https://picsum.photos/200/300';
				img.alt = 'Injected Image';
				img.style.position = 'fixed';
				img.style.bottom = '10px';
				img.style.right = '10px';
				img.style.zIndex = '10000';
				img.style.width = '150px';
				img.style.height = '150px';
				console.log('Image Injected');
				document.body.appendChild(img);
			},
		});
	}
});
