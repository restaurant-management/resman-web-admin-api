import React, {Component} from 'react';
import img_page404 from '../assets/images/logo-big.png';

export default class Page404 extends Component {
    public render() {
        return (
            <div className='bg-1'>
                <div id='wrap'>
                    <div className='row'>
                        <div id='content' className='col-md-12 full-page error'>
                            <div className='search'>
                                <input type='text' className='form-control' placeholder='Search...'/>
                            </div>
                            <div className='inside-block'>
                                <img src={img_page404} alt={''} className='logo'/>
                                    <h1 className='error'>Error <strong>404</strong></h1>
                                    <p className='lead'><span className='overline'>something's</span> not right here</p>
                                    <p>the page you are looking for cannot be found</p>
                                    <div className='controls'>
                                        <button className='btn btn-cyan'><i className='fa fa-refresh'/> Try Again
                                        </button>
                                        <button className='btn btn-greensea'><i className='fa fa-home'/> Return to
                                            home
                                        </button>
                                        <button className='btn btn-red'><i className='fa fa-envelope'/> Contact
                                            Support
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
    }

    }
