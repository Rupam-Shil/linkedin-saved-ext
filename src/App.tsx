function App() {
	const handleAction = (action: string) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				// Send message with tab ID
				chrome.runtime.sendMessage({
					action: action,
					tabId: tabs[0].id,
				});
			}
		});
	};

	return (
		<div className="App">
			<button onClick={() => handleAction('add_image')}>Add Image</button>
			<button onClick={() => handleAction('remove_image')}>Remove Image</button>
		</div>
	);
}

export default App;
