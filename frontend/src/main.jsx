import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal, { ModalProvider } from './context/Modal';
import { Provider } from 'react-redux';
import App from './App';

import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import * as groupActions from './store/groups';
import * as eventActions from './store/events';

import './normalize.css';
import './index.css';

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = sessionActions;
    window.groupActions = groupActions;
    window.eventActions = eventActions
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ModalProvider>
            <Provider store={store}>
                <App />
                <Modal />
            </Provider>
        </ModalProvider>
    </React.StrictMode>
);
