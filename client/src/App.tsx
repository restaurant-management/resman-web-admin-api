import { ApolloProvider } from '@apollo/react-hooks';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { SnackbarProvider } from 'notistack';
import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Config } from './config';
import { GraphClient } from './lib/graphClient';
import { PrivateRoute } from './lib/privateRoute';
import { Permission } from './models/permission';
import { User } from './models/user';
import BlankPage from './pages/blank-page';
import Components from './pages/components';
import { CustomerPage } from './pages/customer/customer';
import DashBoard from './pages/dashboard';
import { DishPage } from './pages/dish/dish';
import LogIn from './pages/login';
import { Logout } from './pages/logout';
import Page403 from './pages/page403';
import Page404 from './pages/page404';
import Page500 from './pages/page500';
import { RolePage } from './pages/role/role';
import { StorePage } from './pages/store/store';
import { DailyDishPage } from './pages/dailyDish/dailyDish';
import { UserPage } from './pages/user/user';
import WelcomePage from './pages/welcomePage';
import { Repository } from './repository';
import { LoadScriptFile } from './utils/loadScript';
import { WarehousePage } from './pages/warehouse/warehouse';

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext(Repository.currentUser);

class App extends Component<any, { currentUser?: User }> {

    constructor(props: {}) {
        super(props);
        this.state = {
            currentUser: Repository.currentUser
        };
    }

    public componentDidMount() {
        LoadScriptFile('/assets/js/jquery.js');
        LoadScriptFile('/assets/js/bootstrap.min.js');
        LoadScriptFile('/assets/js/bootstrap-dropdown-multilevel.js');
        LoadScriptFile('/assets/js/jquery.mmenu.min.js');
        LoadScriptFile('/assets/js/jquery.sparkline.min.js');
        // LoadScriptFile('/assets/js/jquery.nicescroll.min.js');
        LoadScriptFile('/assets/js/jquery.animateNumbers.js');
        LoadScriptFile('/assets/js/jquery.videobackground.js');
        LoadScriptFile('/assets/js/jquery.blockUI.js');
        LoadScriptFile('/assets/js/run_prettifyf793.js');

        LoadScriptFile('/assets/js/minimal.min.js');

        Repository.me().then(value => this.setState({ currentUser: value }));
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
                                <PrivateRoute permissions={[Permission.user.list]} path='/users' component={UserPage} />
                                <PrivateRoute
                                    permissions={[Permission.customer.list]} path='/customers' component={CustomerPage}
                                />
                                <PrivateRoute
                                    permissions={[Permission.store.list]} path='/stores' component={StorePage} />
                                <PrivateRoute
                                    permissions={[Permission.warehouse.list]} path='/warehouses'
                                    component={WarehousePage}
                                />
                                <PrivateRoute permissions={[Permission.role.list]} path='/roles' component={RolePage} />
                                <PrivateRoute
                                    permissions={[Permission.dish.list]} path='/dishes' component={DishPage} />
                                <PrivateRoute
                                    permissions={[Permission.dailyDish.list]} path='/daily-dishes'
                                    component={DailyDishPage}
                                />
                                <Route path='/login' component={LogIn} />
                                <Route path='/logout' component={Logout} />
                                <Route path='/page500' component={Page500} />
                                <Route path='/403' component={Page403} />
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
