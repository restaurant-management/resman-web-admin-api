import React, { Component } from 'react';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/minimal.css';
import logo from '../assets/images/logo-big.png';

export default class WelcomePage extends Component {
    public render() {
        return (
            <div className='bg-1'>
                <div id='wrap'>
                    <div className='row'>
                        <div id='content' className='col-md-12 full-page error'>
                            <div className='inside-block'>
                                <img src={logo} alt={''} className='logo' />
                                <h1 className='error'>RES<strong>MAN</strong></h1>
                                <p className='lead'>
                                    <span className='overline'>Welcome to</span>
                                </p>
                                <p>Web Admin of Resman System</p>
                                <div className='controls'>
                                    <a className='btn btn-greensea' href='/login'>
                                        <i className='fa fa-sign-in' /> Login
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
