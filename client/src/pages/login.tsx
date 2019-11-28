import React, { Component } from 'react';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/minimal.css';
import img_Login from '../assets/images/logo-big.png';
import { Checkbox } from '../components/checkbox';

export default class LogIn extends Component<{}, { username: string, password: string, remember: boolean }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: true
        };
    }

    public render(): JSX.Element {
        return (
            <div className='bg-1'>
                <div id='wrap'>
                    <div className='row'>
                        <div id='content' className='col-md-12 full-page login'>
                            <div className='inside-block'>
                                <img src={img_Login} alt={''} className='logo' />
                                <h1><strong>Welcome</strong> Stranger</h1>
                                <h5>Resman</h5>
                                <form id='form-signin' className='form-signin'>
                                    <section>
                                        <div className='input-group'>
                                            <input type='text' className='form-control' name='username'
                                                value={this.state.username} placeholder='Username'
                                                onChange={(event) => {
                                                    this.setState({ username: event.target.value });
                                                }}
                                            />
                                            <div className='input-group-addon'><i className='fa fa-user' /></div>
                                        </div>
                                        <div className='input-group'>
                                            <input type='password' className='form-control' name='password'
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
                                        <a className='btn btn-greensea' href='/blank-page'
                                            onClick={() => { console.log(this.state); }}>Log In</a>
                                        <span>or</span>
                                        <button className='btn btn-slategray'>Create an account</button>
                                    </section>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);

    }
}
