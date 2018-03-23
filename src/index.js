import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

import App from "./App";
import "./index.css";

import reducer from "./redux/reducers";

let middleware = [thunk];

if (process.env.NODE_ENV !== "production") {
  const createLogger = require("redux-logger");
  middleware = [...middleware, createLogger()];
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
