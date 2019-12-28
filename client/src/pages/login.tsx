import { Snackbar } from '@material-ui/core';
import React, { Component } from 'react';
import { Redirect, RouteProps } from 'react-router-dom';
import img_Login from '../assets/images/logo-big.png';
import { Checkbox } from '../components/checkbox';
import LoadingIndicator from '../components/loadingIndicator';
import { SnackBarContentWrapper } from '../components/snackBarContentWrapper';
import { Repository } from '../repository';
import { NotificationIndicator } from '../components/notificationIndicator';

export default class LogIn extends Component<RouteProps,
    {
        username: string, password: string, remember: boolean, hasError: boolean, errorMessage: string,
        loading: boolean, redirectToReferrer: boolean
    }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: true,
            hasError: false,
            errorMessage: '',
            loading: false,
            redirectToReferrer: Repository.isAuth
        };
    }

    public render(): JSX.Element {
        const from = this.props.location && this.props.location.state
            ? this.props.location.state.from : Repository.isAuth ? { pathname: '/dashboard' } : { pathname: '/' };

        if (this.state.redirectToReferrer) {
            return <Redirect to={from} push />;
        }

        return (
            <div id='wrap'>
                <LoadingIndicator show={this.state.loading} />
                <div className='row'>
                    <div id='content' className='col-md-12 full-page login' style={{ overflow: 'hidden' }}>
                        <div className='inside-block'>
                            <img src={img_Login} alt={''} className='logo' />
                            <h1><strong>Welcome</strong> Stranger</h1>
                            <h5>Resman</h5>
                            <div className='form'>
                                <section>
                                    <div className='input-group'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={this.state.username}
                                            placeholder='Username'
                                            onChange={(event) => {
                                                this.setState({ username: event.target.value });
                                            }}
                                        />
                                        <div className='input-group-addon'><i className='fa fa-user' /></div>
                                    </div>
                                    <div className='input-group'>
                                        <input type='password' className='form-control'
                                            placeholder='Password'
                                            onChange={(event) => {
                                                this.setState({ password: event.target.value });
                                            }} />
                                        <div className='input-group-addon'><i className='fa fa-key' /></div>
                                    </div>
                                </section>
                                <section className='controls'>
                                    <div className='checkbox check-transparent'>
                                        <Checkbox label={'Remember'} id={'remember'} checked={this.state.remember}
                                            onChange={(value) => {
                                                this.setState({ remember: value });
                                            }}
                                        />
                                    </div>
                                    <a href='#/'>Forget password?</a>
                                </section>
                                <section className='log-in'>
                                    <button
                                        disabled={this.state.loading}
                                        className='btn btn-greensea'
                                        onClick={this._login.bind(this)}
                                    >
                                        Log In
                                    </button>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationIndicator message={this.state.errorMessage} variant={'error'} />
            </div>
        );

    }

    private _handleCloseSnackBar() {
        this.setState({ hasError: false });
    }

    private async _login() {
        this.setState({ loading: true });
        try {
            await Repository.login(this.state.username, this.state.password, this.state.remember);
            this.setState({ redirectToReferrer: true });
        } catch (e) {
            console.log(e);
            this.setState({ hasError: true, errorMessage: e.message });
        }
    }
}
