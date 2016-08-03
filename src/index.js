import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import App from './App';
import './index.css';

import reduxMiddleware from './redux/middleware';
import reducer from './redux/reducers';

let dte = window.devToolsExtension ? window.devToolsExtension() : function() {};

let store = createStore(reducer,
                        compose(applyMiddleware(reduxMiddleware, thunk), dte));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
