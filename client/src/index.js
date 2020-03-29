/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/index.js
 * Created:  2019-02-16 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-12-23
 * Changes:  Adding PersistGate for redux-persist.
 * Editor:   Brad Kaufman
 */
import React from "react";
import * as ReactDOM from "react-dom";
import "./stylesheets/index.css";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import Log from "./util/Log";
import { Provider } from "react-redux";
import { store, persistor } from "./redux";
import { PersistGate } from "redux-persist/lib/integration/react";

const LoadingView = () => <div>Loading...</div>;

// configure logging
if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "valueinfinity-mvp-client:*");
  Log.trace("Logging scope set to valueinfinity-mvp-client:*");
}

// setup the DOM rendition
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change unregister() to register() below.
// Note this comes with some pitfalls. Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
