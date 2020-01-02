import { ApolloProvider } from '@apollo/react-hooks';
import { SnackbarProvider } from 'notistack';
import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Config } from './config';
import { GraphClient } from './lib/graphClient';
import { PrivateRoute } from './lib/privateRoute';
import { User } from './models/user';
import BlankPage from './pages/blank-page';
import Components from './pages/components';
import { CustomerPage } from './pages/customer/customer';
import DashBoard from './pages/dashboard';
import LogIn from './pages/login';
import { Logout } from './pages/logout';
import Page404 from './pages/page404';
import Page500 from './pages/page500';
import { UserPage } from './pages/user/user';
import WelcomePage from './pages/welcomePage';
import { Repository } from './repository';

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext(Repository.currentUser);

class App extends Component<any, {currentUser?: User}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            currentUser: Repository.currentUser
        };
    }

    public componentDidMount() {
        Repository.me().then(value => this.setState({currentUser: value}));
    }

    public render() {
        return (
            <SnackbarProvider
                maxSnack={3}
                preventDuplicate
            >
                <ApolloProvider client={GraphClient.create()}>
                    <UserContext.Provider value={this.state.currentUser}>
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
                                <PrivateRoute path='/customers' component={CustomerPage} />
                                <Route path='/login' component={LogIn} />
                                <Route path='/logout' component={Logout} />
                                <Route path='/page500' component={Page500} />
                                <Route path='/' exact component={WelcomePage} />
                                <PrivateRoute path='/dashboard' exact component={DashBoard} />
                                <Route component={Page404} />
                            </Switch>
                        </BrowserRouter>
                    </UserContext.Provider>
                </ApolloProvider>
            </SnackbarProvider>
        );
    }
}

export default App;
