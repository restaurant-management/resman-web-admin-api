import React, { Component } from 'react';
import { User } from '../../models/user';
import SideBar from '../sidebar';
import { QuickActions } from './quickActions';

export class Navbar extends Component {
    public render() {
        return (
            <div className='navbar navbar-default navbar-fixed-top navbar-transparent-black mm-fixed-top'
                role='navigation' id='navbar'>

                <div className='navbar-header col-md-2'>
                    <a className='navbar-brand' href='/'>
                        <strong>RES</strong>MAN
                    </a>
                    <div className='sidebar-collapse'>
                        <a href='#/'>
                            <i className='fa fa-bars' />
                        </a>
                    </div>
                </div>

                <div className='navbar-collapse'>
                    {/*Page Refresh*/}
                    <ul className='nav navbar-nav refresh'>
                        <li className='divided'>
                            <a href='#/' className='page-refresh'><i className='fa fa-refresh' /></a>
                        </li>
                    </ul>
                    {/*/Page Refresh*/}

                    {/*Search*/}
                    <div className='search' id='main-search'>
                        <i className='fa fa-search' /> <input type='text' placeholder='Search...' />
                    </div>
                    {/*/Search*/}
                    <QuickActions user={User.fromJson({name: 'Hieren Lee', avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4'})} />
                    <SideBar />
                </div>
            </div>
        );
    }
}
