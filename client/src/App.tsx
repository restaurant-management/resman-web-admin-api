import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BlankPage from './pages/blank-page';
import LogIn from './pages/login';
import Page404 from './pages/page404';
import Page500 from './pages/page500';
import WelcomePage from './pages/welcomePage';

class App extends Component {
    public render() {
        return (
            <Router>
                <Switch>
                    <Route path='/blank-page' component={BlankPage} />
                    <Route path='/login' component={LogIn} />
                    <Route path='/page500' component={Page500} />
                    <Route path='/page404' component={Page404} />
                    <Route path='/' exact component={WelcomePage} />
                </Switch>
            </Router>
        );
    }
}

export default App;
