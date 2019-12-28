import { ApolloProvider } from '@apollo/react-hooks';
import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/css/agGridStyles.scss';
import './assets/css/animate.css';
import './assets/css/bootstrap-checkbox.css';
import './assets/css/bootstrap-dropdown-multilevel.css';
import './assets/css/bootstrap.min.css';
import './assets/css/chosen-bootstrap.css';
import './assets/css/chosen.min.css';
import './assets/css/ColVis.css';
import './assets/css/component.css';
import './assets/css/dataTables.bootstrap.css';
import './assets/css/font-awesome.min.css';
import './assets/css/jquery.mmenu.all.css';
import './assets/css/jquery.videoBackground.css';
import './assets/css/minimal.css';
import './assets/css/resman.scss';
import { Config } from './config';
import { GraphClient } from './lib/graphClient';
import { PrivateRoute } from './lib/privateRoute';
import BlankPage from './pages/blank-page';
import Components from './pages/components';
import DashBoard from './pages/dashboard';
import LogIn from './pages/login';
import { Logout } from './pages/logout';
import Page404 from './pages/page404';
import Page500 from './pages/page500';
import { UserPage } from './pages/user/user';
import WelcomePage from './pages/welcomePage';
import { Repository } from './repository';
import { LoadScriptFile } from './utils/loadScript';

class App extends Component {
    public componentDidMount() {
        LoadScriptFile('/assets/js/jquery.js');
    }

    public render() {
        return (
            <ApolloProvider client={GraphClient.create()}>
                <BrowserRouter>
                    <IdleTimer
                        element={document}
                        debounce={250}
                        onIdle={() => {
                            if (Repository.isAuth && !Repository.isRemember) {
                                Repository.logout().then(() => {
                                    window.location.reload();
                                });
                            }
                        }}
                        timeout={Config.idleTimeout}
                    />

                    <Switch>
                        <Route path='/blank-page' component={BlankPage} />
                        <Route path='/components' component={Components} />
                        <PrivateRoute path='/users' component={UserPage} />
                        <Route path='/login' component={LogIn} />
                        <Route path='/logout' component={Logout} />
                        <Route path='/page500' component={Page500} />
                        <Route path='/' exact component={WelcomePage} />
                        <PrivateRoute path='/dashboard' exact component={DashBoard} />
                        <Route component={Page404} />
                    </Switch>
                </BrowserRouter>
            </ApolloProvider>
        );
    }
}

export default App;
