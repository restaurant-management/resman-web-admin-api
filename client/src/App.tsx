import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import BlankPage from "./pages/blank-page";
import LogIn from "./pages/login";
import Page500 from "./pages/page500";
import Page404 from "./pages/page404";

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={BlankPage} />
                <Route path="/login" component={LogIn} />
                <Route path="/page500" component={Page500} />
                <Route path="/page404" component={Page404} />
            </Router>
        );
    };
}

export default App;
