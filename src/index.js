import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import reducer from './redux'

let store = createStore(reducer,
                        window.devToolsExtension && window.devToolsExtension());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
