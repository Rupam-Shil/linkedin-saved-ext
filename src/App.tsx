function App() {
	const handleAddImage = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				// Send message with tab ID
				chrome.runtime.sendMessage({
					action: 'add_image',
					tabId: tabs[0].id,
				});
			}
		});
	};

	return (
		<div className="App">
			<button onClick={handleAddImage}>Add Image</button>
		</div>
	);
}

export default App;
