import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-big.png';
import { Repository } from '../repository';

export default class WelcomePage extends Component {
    public render() {
        return (
            <div id='wrap'>
                <div className='row'>
                    <div id='content' className='col-md-12 full-page error' style={{ overflow: 'hidden' }}>
                        <div className='inside-block'>
                            <img src={logo} alt={''} className='logo' />
                            <h1 className='error'>RES<strong>MAN</strong></h1>
                            <p className='lead'>
                                <span className='overline'>Welcome to</span>
                            </p>
                            <p>Web Admin of Resman System</p>
                            <div className='controls'>
                                {!Repository.isAuth
                                    ? (
                                        <Link className='btn btn-greensea' to='/login'>
                                            <i className='fa fa-sign-in' /> Login
                                        </Link>
                                    )
                                    : (
                                        <Link className='btn btn-greensea' to='/dashboard'>
                                            <i className='fa fa-sign-in' /> Dashboard
                                        </Link>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
