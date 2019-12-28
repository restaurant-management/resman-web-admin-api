import { ApolloProvider } from '@apollo/react-hooks';
import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Repository } from '../repository';

export class PrivateRoute extends Component<RouteProps, {}> {
    public render() {
        if (Repository.isAuth) {
            return (
                <ApolloProvider client={Repository.getGraphAuthClient()}>
                    <Route {...this.props} />
                </ApolloProvider>
            );
        }

        const fromPath = Array.isArray(this.props.path) ? this.props.path[0] : this.props.path;

        return (<Redirect to={{ pathname: '/login', state: { from: fromPath } }} />);
    }
}
