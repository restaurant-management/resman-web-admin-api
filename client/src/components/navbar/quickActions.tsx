import { ClickAwayListener, Grow } from '@material-ui/core';
import Image from 'material-ui-image';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { User } from '../../models/user';

export interface QuickActionsProp {
    user: User;
}

export interface QuickActionsState {
    setting?: { background: string };
    openUserBlock: boolean;
    openNotifyBlock: boolean;
}

export class QuickActions extends Component<QuickActionsProp, QuickActionsState> {

    constructor(props: QuickActionsProp) {
        super(props);
        this.state = {
            openUserBlock: false,
            openNotifyBlock: false
        };
    }

    public render() {
        return (
            <ul className='nav navbar-nav quick-actions'>
                {/* Notification Icon */}
                <ClickAwayListener onClickAway={this._onClickAway.bind(this)}>
                    <li className='dropdown divided open'>

                        <Link
                            className='dropdown-toggle button' to='#'
                            onClick={() =>
                                this.setState({ openNotifyBlock: !this.state.openNotifyBlock, openUserBlock: false })}
                        >
                            <i className='fa fa-bell' />
                            <span className='label label-transparent-black'>3</span>
                        </Link>

                        <Grow in={this.state.openNotifyBlock} style={{ transformOrigin: '50% 0 0' }}>
                            <ul className='dropdown-menu wide arrow nopadding bordered'>
                                <li><h1>You have <strong>3</strong> new notifications</h1></li>

                                <li>
                                    <Link to='#'>
                                        <span className='label label-green'><i className='fa fa-user' /></span>
                                        New user registered.
                                <span className='small'>18 mins</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to='#'>
                                        <span className='label label-red'><i
                                            className='fa fa-power-off' /></span>
                                        Server down.
                                <span className='small'>27 mins</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to='#'>
                                        <span className='label label-orange'><i className='fa fa-plus' /></span>
                                        New order.
                                <span className='small'>36 mins</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to='#'>
                                        <span className='label label-cyan'><i
                                            className='fa fa-power-off' /></span>
                                        Server restared.
                                <span className='small'>45 mins</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to='#'>
                                        <span className='label label-amethyst'>
                                            <i className='fa fa-power-off' />
                                        </span>
                                        Server started.
                                <span className='small'>50 mins</span>
                                    </Link>
                                </li>

                                <li><Link to='#'>Check all notifications <i className='fa fa-angle-right' /></Link>
                                </li>
                            </ul>
                        </Grow>
                    </li>
                </ClickAwayListener>
                {/*END  Notification Icon */}

                <ClickAwayListener onClickAway={this._onClickAway.bind(this)}>
                    <li className={`dropdown block user open`} id='current-user'>
                        <UserContext.Consumer>
                            {value => value && (
                                <>
                                    <div className='profile-photo'>
                                        <Image src={value.avatar || ''} />
                                    </div>
                                    <Link
                                        className='dropdown-toggle options' to='#'
                                        onClick={() =>
                                            this.setState({
                                                openUserBlock: !this.state.openUserBlock, openNotifyBlock: false
                                            })}
                                    >
                                        {`${value.fullName || value.username} `}
                                        <i className='fa fa-caret-down' />
                                    </Link>
                                </>
                            )}
                        </UserContext.Consumer>

                        <Grow in={this.state.openUserBlock} style={{ transformOrigin: '50% 0 0' }}>
                            <ul className='dropdown-menu arrow settings'>

                                <li>
                                    <h3>Backgrounds:</h3>
                                    <ul id='color-schemes'>
                                        {this._renderListColorSchemes('normal', 6)}
                                        <li className='title'>Solid Backgrounds:</li>
                                        {this._renderListColorSchemes('solid', 6)}
                                    </ul>

                                </li>

                                <li className='divider' />

                                <li>

                                    <div className='form-group videobg-check'>
                                        <label className='col-xs-8 control-label'>Video BG</label>
                                        <div className='col-xs-4 control-label'>
                                            <div className='onoffswitch greensea small'>
                                                <input type='checkbox' name='onoffswitch'
                                                    className='onoffswitch-checkbox' id='videobg-check' />
                                                <label className='onoffswitch-label'
                                                    htmlFor='videobg-check'>
                                                    <span className='onoffswitch-inner' />
                                                    <span className='onoffswitch-switch' />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <ul id='videobackgrounds'>
                                        <li className='title'>Choose type:</li>
                                        <li><Link to='#' className='video-bg-1'> </Link></li>
                                        <li><Link to='#' className='video-bg-2'> </Link></li>
                                        <li><Link to='#' className='video-bg-3'> </Link></li>
                                        <li><Link to='#' className='video-bg-4'> </Link></li>
                                        <li><Link to='#' className='video-bg-5'> </Link></li>
                                        <li><Link to='#' className='video-bg-6'> </Link></li>
                                        <li><Link to='#' className='video-bg-7'> </Link></li>
                                        <li><Link to='#' className='video-bg-8'> </Link></li>
                                        <li><Link to='#' className='video-bg-9'> </Link></li>
                                        <li><Link to='#' className='video-bg-10'> </Link></li>
                                    </ul>

                                </li>

                                <li className='divider' />

                                <li>
                                    <Link to='#'><i className='fa fa-user' /> Profile</Link>
                                </li>

                                <li>
                                    <Link to='#'><i className='fa fa-calendar' /> Calendar</Link>
                                </li>

                                <li>
                                    <Link to='#'>
                                        <i className='fa fa-envelope' />
                                        {' Inbox '}
                                        <span className='badge badge-red' id='user-inbox'>3</span>
                                    </Link>
                                </li>

                                <li className='divider' />

                                <li>
                                    <Link to={'/logout'}>
                                        <i className='fa fa-power-off' />
                                        {` Logout`}
                                    </Link>
                                </li>
                            </ul>
                        </Grow>
                    </li>
                </ClickAwayListener>

            </ul>);
    }

    private _getColorSchemeClassName(id: number, type: 'normal' | 'solid') {
        let className = '';
        if (type === 'solid') { className += 'solid-'; }
        className += 'bg-' + (id % 6).toString();

        return className;
    }

    private _renderListColorSchemes(type: 'normal' | 'solid', number: number) {
        const result: JSX.Element[] = [];

        for (let i = 1; i <= number; i++) {
            const className = this._getColorSchemeClassName(i, type);
            result.push(
                <li key={className}>
                    <Link
                        to='#/'
                        className={className}
                        onClick={() => { document.body.className = className; }}>
                    </Link>
                </li>
            );
        }

        return result;
    }

    private _onClickAway() {
        this.setState({ openNotifyBlock: false, openUserBlock: false });
    }
}
