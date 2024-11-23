import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.scss';
import Popup from './popup/Popup';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Popup />
	</StrictMode>
);
