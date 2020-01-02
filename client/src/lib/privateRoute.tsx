import { ApolloProvider } from '@apollo/react-hooks';
import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Repository } from '../repository';

interface PrivateRouteProps extends RouteProps {
    readonly permissions?: string[]; // Permissions OR
}

export class PrivateRoute extends Component<PrivateRouteProps, {}> {
    public render() {
        if (Repository.isAuth) {
            if (this.props.permissions) {
                if (!Repository.author(this.props.permissions)) {
                    return <Redirect to={{ pathname: '/403' }} />;
                }
            }

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
