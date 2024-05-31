import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// Style
import "./styles/index.css";
import "./styles/colors.css";
import { ConfigProvider } from 'antd'
import hrHR from 'antd/lib/locale/hr_HR'

// App
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={hrHR}>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();