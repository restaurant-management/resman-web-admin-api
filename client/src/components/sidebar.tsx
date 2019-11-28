import React, { Component } from 'react';
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
                    <a href='#/' className='sidebar-toggle' data-toggle='#navigation'>Navigation <i
                        className='fa fa-angle-up' /></a>

                    <ul className='menu'>
                        <Li>
                            <a href='#/'>
                                <i className='fa fa-tachometer' />
                                {` Dashboard`}
                                <span className='badge badge-red'>1</span>
                            </a>
                        </Li>
                        <Li>
                            <a href='/users'>
                                <i className='fa fa-user' />
                                {` Users`}
                            </a>
                        </Li>

                        <Li>
                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-list' /> Forms <b className='fa fa-plus dropdown-plus' />
                            </a>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Common Elements`}
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Validation`}
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' />
                                        {` Form Wizard`}
                                    </a>
                                </Li>
                            </ul>
                        </Li>

                        <Li className='dropdown'>
                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-pencil' /> Interface <b className='fa fa-plus dropdown-plus' />
                            </a>
                            <ul className='dropdown-menu'>
                                <Li key='UI Elements'>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> UI Elements
                                    </a>
                                </Li>
                                <Li key='Typography'>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Typography
                                    </a>
                                </Li>
                                <Li key='Tiles'>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Tiles
                                    </a>
                                </Li>
                                <Li key='Portlets'>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Portlets
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li key='Nestable Lists'>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Nestable Lists
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                            </ul>
                        </Li>

                        <Li>
                            <a href='#/'>
                                <i className='fa fa-tint' /> Buttons & Icons
                            </a>
                        </Li>
                        <Li>
                            <a href='#/'>
                                <i className='fa fa-th' /> Grid Layout
                            </a>
                        </Li>

                        <Li className='dropdown'>
                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-th-large' /> Tables <b className='fa fa-plus dropdown-plus' />
                            </a>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Bootstrap Tables
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> DataTables
                                    </a>
                                </Li>
                            </ul>
                        </Li>

                        <Li className='dropdown active open'>
                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-desktop' /> Example Pages <b className='fa fa-plus dropdown-plus' />
                                <span className='label label-greensea'>mails</span>
                            </a>
                            <ul className='dropdown-menu'>
                                <Li>
                                    <a href='/login'>
                                        <i className='fa fa-caret-right' /> Login Page
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Calendar
                                    </a>
                                </Li>
                                <Li>
                                    <a href='/page404'>
                                        <i className='fa fa-caret-right' /> Page 404
                                    </a>
                                </Li>
                                <Li>
                                    <a href='/page500'>
                                        <i className='fa fa-caret-right' /> Page 500
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Page Offline
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Invoice
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li className='active'>
                                    <a href='/blank-page'>
                                        <i className='fa fa-caret-right' /> Blank Page
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Locked Screen
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Gallery
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Timeline
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Chat
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Search Results
                                        <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Profile Page
                                            <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Weather Page
                                            <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Front Page
                                            <span className='label label-greensea'>new</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Vertical Mail
                                            <span className='badge badge-red'>5</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Horizontal Mail
                                            <span className='label label-greensea'>mails</span>
                                    </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Vector Maps
                                        </a>
                                </Li>
                                <Li>
                                    <a href='#/'>
                                        <i className='fa fa-caret-right' /> Google Maps
                                        </a>
                                </Li>
                            </ul>
                        </Li>

                        <Li>
                            <a href='#/'>
                                <i className='fa fa-play-circle' /> Widgets
                            </a>
                        </Li>

                        <Li>
                            <a href='#/'>
                                <i className='fa fa-bar-chart-o' /> Charts & Graphs
                            </a>
                        </Li>

                        <li className='dropdown'>
                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'>
                                <i className='fa fa-folder' /> Menu Levels <b className='fa fa-plus dropdown-plus' />
                                <span className='label label-cyan'>new</span>
                            </a>
                            <ul className='dropdown-menu'>
                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 1.1</a></Li>

                                <Li className='dropdown'>
                                    <a href='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                        className='fa fa-folder' /> Menu Level 1.2 <b
                                            className='fa fa-plus dropdown-plus' /></a>
                                    <ul className='dropdown-menu'>
                                        <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 2.1</a></Li>
                                        <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 2.2</a></Li>
                                        <Li className='dropdown'>
                                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                className='fa fa-folder' /> Menu Level 2.3 <b
                                                    className='fa fa-plus dropdown-plus' /></a>
                                            <ul className='dropdown-menu'>
                                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 3.1</a>
                                                </Li>
                                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 3.2</a>
                                                </Li>
                                                <Li className='dropdown'>
                                                    <a href='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                        className='fa fa-folder' /> Menu Level 3.3 <b
                                                            className='fa fa-plus dropdown-plus' /></a>
                                                    <ul className='dropdown-menu'>
                                                        <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level
                                                            4.1</a></Li>
                                                        <Li className='dropdown'>
                                                            <a href='#/' className='dropdown-toggle'
                                                                data-toggle='dropdown'><i
                                                                    className='fa fa-folder' /> Menu Level 4.2 <b
                                                                    className='fa fa-plus dropdown-plus' /></a>
                                                            <ul className='dropdown-menu'>
                                                                <Li>
                                                                    <a href='#/'>
                                                                        <i className='fa fa-caret-right' />
                                                                        <span> Menu Level 5.1</span>
                                                                    </a>
                                                                </Li>
                                                                <Li>
                                                                    <a href='#/'>
                                                                        <i className='fa fa-caret-right' />
                                                                        <span> Menu Level 5.2</span>
                                                                    </a>
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
                                    <a href='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                        className='fa fa-folder' /> Menu Level 1.3 <b
                                            className='fa fa-plus dropdown-plus' /></a>
                                    <ul className='dropdown-menu'>
                                        <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 2.1</a></Li>
                                        <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 2.2</a></Li>
                                        <Li className='dropdown'>
                                            <a href='#/' className='dropdown-toggle' data-toggle='dropdown'><i
                                                className='fa fa-folder' /> Menu Level 2.3 <b
                                                    className='fa fa-plus dropdown-plus' /></a>
                                            <ul className='dropdown-menu'>
                                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 3.1</a>
                                                </Li>
                                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 3.2</a>
                                                </Li>
                                                <Li><a href='#/'><i className='fa fa-caret-right' /> Menu Level 3.3</a>
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
                    <a href='/#' className='sidebar-toggle underline' data-toggle='#order-summary'>Orders Summary <i
                        className='fa fa-angle-up' /></a>

                    <div className='media'>
                        <a className='pull-right' href='/#'>
                            <span id='sales-chart' />
                        </a>
                        <div className='media-body'>
                            This week sales
                            <h3 className='media-heading'>26, 149</h3>
                        </div>
                    </div>

                    <div className='media'>
                        <a className='pull-right' href='/#'>
                            <span id='balance-chart' />
                        </a>
                        <div className='media-body'>
                            This week balance
                            <h3 className='media-heading'>318, 651</h3>
                        </div>
                    </div>

                </li>

                <li className='settings' id='general-settings'>
                    <a href='/#' className='sidebar-toggle underline' data-toggle='#general-settings'>
                        General Settings <i className='fa fa-angle-up' />
                    </a>

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
