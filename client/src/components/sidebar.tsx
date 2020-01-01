import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Li } from './li';

export default class SideBar extends Component {
    public render() {
        return (
            <ul className='nav navbar-nav side-nav' id='sidebar'>

                <li className='collapsed-content'>
                    <ul>
                        <Li key='search' className='search'></Li>
                    </ul>
                </li>

                <li className='navigation' id='navigation'>
                    <Link to='#/' className='sidebar-toggle' data-toggle='#navigation'>Navigation <i
                        className='fa fa-angle-up' /></Link>

                    <ul className='menu'>
                        <Li>
                            <Link to='/dashboard'>
                                <i className='fa fa-tachometer' />
                                {` Dashboard`}
                                <span className='badge badge-red'>1</span>
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/users'>
                                <i className='fa fa-user' />
                                {` Users`}
                            </Link>
                        </Li>

                        <Li>
                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-list' /> Forms <b className='fa fa-plus dropdown-plus' />
                            </Link>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Common Elements`}
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Validation`}
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Form Wizard`}
                                    </Link>
                                </Li>
                            </ul>
                        </Li>

                        <Li className='dropdown'>
                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-pencil' /> Interface <b className='fa fa-plus dropdown-plus' />
                            </Link>
                            <ul className='dropdown-menu'>
                                <Li key='UI Elements'>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> UI Elements
                                    </Link>
                                </Li>
                                <Li key='Typography'>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Typography
                                    </Link>
                                </Li>
                                <Li key='Tiles'>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Tiles
                                    </Link>
                                </Li>
                                <Li key='Portlets'>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Portlets
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li key='Nestable Lists'>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Nestable Lists
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                            </ul>
                        </Li>

                        <Li>
                            <Link to='#/'>
                                <i className='fa fa-tint' /> Buttons & Icons
                            </Link>
                        </Li>
                        <Li>
                            <Link to='#/'>
                                <i className='fa fa-th' /> Grid Layout
                            </Link>
                        </Li>

                        <Li className='dropdown'>
                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-th-large' /> Tables <b className='fa fa-plus dropdown-plus' />
                            </Link>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Bootstrap Tables
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> DataTables
                                    </Link>
                                </Li>
                            </ul>
                        </Li>

                        <Li className='dropdown active open'>
                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-desktop' /> Example Pages <b className='fa fa-plus dropdown-plus' />
                                <span className='label label-greensea'>mails</span>
                            </Link>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <Link to='/login'>
                                        <i className='fa fa-caret-right' /> Login Page
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Calendar
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='/page404'>
                                        <i className='fa fa-caret-right' /> Page 404
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='/page500'>
                                        <i className='fa fa-caret-right' /> Page 500
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Page Offline
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Invoice
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li className='active'>
                                    <Link to='/blank-page'>
                                        <i className='fa fa-caret-right' /> Blank Page
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Locked Screen
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Gallery
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Timeline
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Chat
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Search Results
                                        <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Profile Page
                                            <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Weather Page
                                            <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Front Page
                                            <span className='label label-greensea'>new</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Vertical Mail
                                            <span className='badge badge-red'>5</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Horizontal Mail
                                            <span className='label label-greensea'>mails</span>
                                    </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Vector Maps
                                        </Link>
                                </Li>
                                <Li>
                                    <Link to='#/'>
                                        <i className='fa fa-caret-right' /> Google Maps
                                        </Link>
                                </Li>
                            </ul>
                        </Li>

                        <Li>
                            <Link to='#/'>
                                <i className='fa fa-play-circle' /> Widgets
                            </Link>
                        </Li>

                        <Li>
                            <Link to='#/'>
                                <i className='fa fa-bar-chart-o' /> Charts & Graphs
                            </Link>
                        </Li>

                        <li className='dropdown'>
                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-folder' /> Menu Levels <b className='fa fa-plus dropdown-plus' />
                                <span className='label label-cyan'>new</span>
                            </Link>
                            <ul className='dropdown-menu'>
                                <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level 1.1</Link></Li>

                                <Li className='dropdown'>
                                    <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                        className='fa fa-folder' /> Menu Level 1.2 <b
                                            className='fa fa-plus dropdown-plus' /></Link>
                                    <ul className='dropdown-menu'>
                                        <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level 2.1</Link></Li>
                                        <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level 2.2</Link></Li>
                                        <Li className='dropdown'>
                                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                className='fa fa-folder' /> Menu Level 2.3 <b
                                                    className='fa fa-plus dropdown-plus' /></Link>
                                            <ul className='dropdown-menu'>
                                                <Li>
                                                    <Link to='#/'>
                                                        <i className='fa fa-caret-right' />{` Menu Level 3.1`}
                                                    </Link>
                                                </Li>
                                                <Li>
                                                    <Link to='#/'>
                                                        <i className='fa fa-caret-right' />{` Menu Level 3.2`}
                                                    </Link>
                                                </Li>
                                                <Li className='dropdown'>
                                                    <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                        className='fa fa-folder' /> Menu Level 3.3 <b
                                                            className='fa fa-plus dropdown-plus' /></Link>
                                                    <ul className='dropdown-menu'>
                                                        <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level
                                                            4.1</Link></Li>
                                                        <Li className='dropdown'>
                                                            <Link to='#/' className='dropdown-toggle'
                                                                data-toggle='dropdown'><i
                                                                    className='fa fa-folder' /> Menu Level 4.2 <b
                                                                    className='fa fa-plus dropdown-plus' /></Link>
                                                            <ul className='dropdown-menu'>
                                                                <Li>
                                                                    <Link to='#/'>
                                                                        <i className='fa fa-caret-right' />
                                                                        <span> Menu Level 5.1</span>
                                                                    </Link>
                                                                </Li>
                                                                <Li>
                                                                    <Link to='#/'>
                                                                        <i className='fa fa-caret-right' />
                                                                        <span> Menu Level 5.2</span>
                                                                    </Link>
                                                                </Li>
                                                            </ul>
                                                        </Li>
                                                    </ul>
                                                </Li>
                                            </ul>
                                        </Li>
                                    </ul>
                                </Li>

                                <Li className='dropdown'>
                                    <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                        className='fa fa-folder' /> Menu Level 1.3 <b
                                            className='fa fa-plus dropdown-plus' /></Link>
                                    <ul className='dropdown-menu'>
                                        <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level 2.1</Link></Li>
                                        <Li><Link to='#/'><i className='fa fa-caret-right' /> Menu Level 2.2</Link></Li>
                                        <Li className='dropdown'>
                                            <Link to='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                className='fa fa-folder' /> Menu Level 2.3 <b
                                                    className='fa fa-plus dropdown-plus' /></Link>
                                            <ul className='dropdown-menu'>
                                                <Li>
                                                    <Link to='#/'>
                                                        <i className='fa fa-caret-right' />{` Menu Level 3.1`}
                                                    </Link>
                                                </Li>
                                                <Li>
                                                    <Link to='#/'>
                                                        <i className='fa fa-caret-right' />{` Menu Level 3.2`}
                                                    </Link>
                                                </Li>
                                                <Li>
                                                    <Link to='#/'>
                                                        <i className='fa fa-caret-right' />{` Menu Level 3.3`}
                                                    </Link>
                                                </Li>
                                            </ul>
                                        </Li>
                                    </ul>
                                </Li>

                            </ul>
                        </li>

                    </ul>

                </li>

                <li className='summary' id='order-summary'>
                    <Link to='/#' className='sidebar-toggle underline' data-toggle='#order-summary'>Orders Summary <i
                        className='fa fa-angle-up' /></Link>

                    <div className='media'>
                        <Link className='pull-right' to='/#'>
                            <span id='sales-chart' />
                        </Link>
                        <div className='media-body'>
                            This week sales
                            <h3 className='media-heading'>26, 149</h3>
                        </div>
                    </div>

                    <div className='media'>
                        <Link className='pull-right' to='/#'>
                            <span id='balance-chart' />
                        </Link>
                        <div className='media-body'>
                            This week balance
                            <h3 className='media-heading'>318, 651</h3>
                        </div>
                    </div>

                </li>

                <li className='settings' id='general-settings'>
                    <Link to='/#' className='sidebar-toggle underline' data-toggle='#general-settings'>
                        General Settings <i className='fa fa-angle-up' />
                    </Link>

                    <div className='form-group'>
                        <label className='col-xs-8 control-label'>Switch ON</label>
                        <div className='col-xs-4 control-label'>
                            <div className='onoffswitch greensea'>
                                <input type='checkbox' name='onoffswitch' className='onoffswitch-checkbox'
                                    id='switch-on' checked onChange={() => { console.log(''); }} />
                                <label className='onoffswitch-label' htmlFor='switch-on'>
                                    <span className='onoffswitch-inner' />
                                    <span className='onoffswitch-switch' />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label className='col-xs-8 control-label'>Switch OFF</label>
                        <div className='col-xs-4 control-label'>
                            <div className='onoffswitch greensea'>
                                <input type='checkbox' name='onoffswitch' className='onoffswitch-checkbox'
                                    id='switch-off' onChange={() => { console.log(''); }} />
                                <label className='onoffswitch-label' htmlFor='switch-off'>
                                    <span className='onoffswitch-inner' />
                                    <span className='onoffswitch-switch' />
                                </label>
                            </div>
                        </div>
                    </div>

                </li>

            </ul>
        );
    }
}
