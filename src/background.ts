const uploadImage = (imageData: string) => {
	return new Promise((resolve, reject) => {
		// perform upload to be if required
		storeImageLocally(imageData).then(resolve).catch(reject);
	});
};

const storeImageLocally = (imageData: string) => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({ 'dress-sense-image': imageData }, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve({ success: true, message: 'Image stored successfully' });
			}
		});
	});
};

const handleImageAdd = (imgUrl: string = 'https://picsum.photos/200/300') => {
	// Check if image already exists
	const existingImg = document.getElementById('dress-sense-injected-image');
	if (existingImg) {
		existingImg.remove();
	}

	const img = document.createElement('img');

	img.setAttribute('id', 'dress-sense-injected-image');

	// Image properties
	img.src = imgUrl;
	img.alt = 'Injected Image';
	img.style.position = 'fixed';
	img.style.bottom = '10px';
	img.style.right = '10px';
	img.style.zIndex = '10000';
	img.style.width = '150px';
	img.style.height = '150px';
	img.style.cursor = 'grab';
	img.style.transformOrigin = 'center';
	img.setAttribute('draggable', 'false');

	document.body.appendChild(img);

	// State variables for interactivity
	let isDragging = false;
	let isResizing = false;
	let isRotating = false;
	let startX = 0;
	let startY = 0;
	let startWidth = 0;
	let startHeight = 0;
	let startAngle = 0;
	let centerX = 0;
	let centerY = 0;

	// Helper function to calculate angle
	const getAngle = (x1: number, y1: number, x2: number, y2: number): number => {
		return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
	};

	// Mouse down event
	img.addEventListener('mousedown', (e: MouseEvent) => {
		if (e.shiftKey) {
			// Start resizing
			isResizing = true;
			startWidth = img.offsetWidth;
			startHeight = img.offsetHeight;
			startX = e.clientX;
			startY = e.clientY;
		} else if (e.altKey) {
			// Start rotating
			isRotating = true;
			const rect = img.getBoundingClientRect();
			centerX = rect.left + rect.width / 2;
			centerY = rect.top + rect.height / 2;
			startAngle = getAngle(centerX, centerY, e.clientX, e.clientY);
		} else {
			// Start dragging
			isDragging = true;
			startX = e.clientX - img.offsetLeft;
			startY = e.clientY - img.offsetTop;
		}
		img.style.cursor = isResizing
			? 'nwse-resize'
			: isRotating
			? 'crosshair'
			: 'grabbing';
	});

	// Mouse move event
	window.addEventListener('mousemove', (e: MouseEvent) => {
		if (isDragging) {
			img.style.left = `${e.clientX - startX}px`;
			img.style.top = `${e.clientY - startY}px`;
		} else if (isResizing) {
			img.style.width = `${startWidth + (e.clientX - startX)}px`;
			img.style.height = `${startHeight + (e.clientY - startY)}px`;
		} else if (isRotating) {
			const angle = getAngle(centerX, centerY, e.clientX, e.clientY);
			img.style.transform = `rotate(${angle - startAngle}deg)`;
		}
	});

	// Mouse up event
	window.addEventListener('mouseup', () => {
		isDragging = false;
		isResizing = false;
		isRotating = false;
		img.style.cursor = 'grab';
	});
};

chrome.runtime.onMessage.addListener((message) => {
	if (message.action === 'add_image' && message.tabId) {
		chrome.scripting.executeScript({
			target: { tabId: message.tabId },
			func: handleImageAdd,
		});
	} else if (message.action === 'remove_image') {
		chrome.scripting.executeScript({
			target: { tabId: message.tabId },
			func: () => {
				const existingImg = document.getElementById(
					'dress-sense-injected-image'
				);
				if (existingImg) {
					existingImg.remove();
				}
			},
		});
	} else if (message.action === 'upload_image') {
		uploadImage(message.imgUrl).then(() => {
			chrome.scripting.executeScript({
				target: { tabId: message.tabId },
				func: handleImageAdd,
				args: [message.imgUrl],
			});
		});
	}
});
