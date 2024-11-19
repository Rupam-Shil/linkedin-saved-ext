import { useEffect, useRef, useState } from 'react';

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [imgList, setImgList] = useState<string[]>([]);

	const sendBgMessage = (payload: Object) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				// Send message with tab ID
				chrome.runtime.sendMessage({
					tabId: tabs[0].id,
					...payload,
				});
			}
		});
	};
	const handleAction = (action: string) => {
		sendBgMessage({ action });
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files![0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (event) {
				setImgList((prev) => [...prev, event.target!.result as string]);
				sendBgMessage({ action: 'upload_image', imgUrl: event.target!.result });
			};
			reader.readAsDataURL(file);
		}
		inputRef.current!.value = '';
	};

	const handleSelectImage = (imgUrl: string) => {
		sendBgMessage({ action: 'select_image', imgUrl });
	};

	useEffect(() => {
		chrome.storage.local.get('dress-sense-image', (result) => {
			setImgList(result['dress-sense-image'] || []);
		});
	}, []);

	return (
		<div className="App">
			<button onClick={() => handleAction('add_image')}>Add Image</button>
			<input
				type="file"
				accept="image/*"
				ref={inputRef}
				className="no-display"
				onChange={handleImageUpload}
			/>
			<div className="flex wrap gap-1">
				{imgList.map((img, index) => (
					<img
						src={img}
						key={index}
						alt="Uploaded"
						onClick={() => handleSelectImage(img)}
						className="preview-img"
					/>
				))}
			</div>
			<button onClick={() => inputRef.current?.click()}>Upload Image</button>
			<button onClick={() => handleAction('remove_image')}>Remove Image</button>
		</div>
	);
}

export default App;
