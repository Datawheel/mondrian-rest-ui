import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import App from './App';
import './index.css';

import reduxMiddleware from './redux/middleware';
import reducer from './redux/reducers';

let store = createStore(reducer,
                        applyMiddleware(reduxMiddleware, thunk, createLogger()));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
