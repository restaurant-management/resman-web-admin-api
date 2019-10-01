import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import BlankPage from './pages/blank-page';
import LogIn from './pages/login';
import Page404 from "./pages/page404";
import Page500 from "./pages/page500";

ReactDOM.render(<Page500 />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
