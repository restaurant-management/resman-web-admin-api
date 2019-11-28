import React, { Component } from 'react';
import { User } from '../../models/user';

export interface QuickActionsProp {
    user: User;
}

export interface QuickActionsState {
    setting?: { background: string };
}

export class QuickActions extends Component<QuickActionsProp, QuickActionsState> {

    constructor(props: QuickActionsProp) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <ul className='nav navbar-nav quick-actions'>
                {/* Notification Icon */}
                <li className='dropdown divided'>

                    <a className='dropdown-toggle button' data-toggle='dropdown' href='#/'>
                        <i className='fa fa-bell' />
                        <span className='label label-transparent-black'>3</span>
                    </a>

                    <ul className='dropdown-menu wide arrow nopadding bordered'>
                        <li><h1>You have <strong>3</strong> new notifications</h1></li>

                        <li>
                            <a href='#/'>
                                <span className='label label-green'><i className='fa fa-user' /></span>
                                New user registered.
                                <span className='small'>18 mins</span>
                            </a>
                        </li>

                        <li>
                            <a href='#/'>
                                <span className='label label-red'><i
                                    className='fa fa-power-off' /></span>
                                Server down.
                                <span className='small'>27 mins</span>
                            </a>
                        </li>

                        <li>
                            <a href='#/'>
                                <span className='label label-orange'><i className='fa fa-plus' /></span>
                                New order.
                                <span className='small'>36 mins</span>
                            </a>
                        </li>

                        <li>
                            <a href='#/'>
                                <span className='label label-cyan'><i
                                    className='fa fa-power-off' /></span>
                                Server restared.
                                <span className='small'>45 mins</span>
                            </a>
                        </li>

                        <li>
                            <a href='#/'>
                                <span className='label label-amethyst'>
                                    <i className='fa fa-power-off' />
                                </span>
                                Server started.
                                <span className='small'>50 mins</span>
                            </a>
                        </li>

                        <li><a href='#/'>Check all notifications <i className='fa fa-angle-right' /></a>
                        </li>
                    </ul>

                </li>
                {/*END  Notification Icon */}

                <li className='dropdown block user' id='current-user'>
                    <div className='profile-photo'>
                        <img src={this.props.user.avatar} alt='' />
                    </div>
                    <a className='dropdown-toggle options' data-toggle='dropdown' href='#/'>
                        {`${this.props.user.name} `}<i className='fa fa-caret-down' />
                    </a>

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
                                <li><a href='#/' className='video-bg-1'> </a></li>
                                <li><a href='#/' className='video-bg-2'> </a></li>
                                <li><a href='#/' className='video-bg-3'> </a></li>
                                <li><a href='#/' className='video-bg-4'> </a></li>
                                <li><a href='#/' className='video-bg-5'> </a></li>
                                <li><a href='#/' className='video-bg-6'> </a></li>
                                <li><a href='#/' className='video-bg-7'> </a></li>
                                <li><a href='#/' className='video-bg-8'> </a></li>
                                <li><a href='#/' className='video-bg-9'> </a></li>
                                <li><a href='#/' className='video-bg-10'> </a></li>
                            </ul>

                        </li>

                        <li className='divider' />

                        <li>
                            <a href='#/'><i className='fa fa-user' /> Profile</a>
                        </li>

                        <li>
                            <a href='#/'><i className='fa fa-calendar' /> Calendar</a>
                        </li>

                        <li>
                            <a href='#/'>
                                <i className='fa fa-envelope' />
                                {' Inbox '}
                                <span className='badge badge-red' id='user-inbox'>3</span>
                            </a>
                        </li>

                        <li className='divider' />

                        <li>
                            <a href='#/'><i className='fa fa-power-off' /> Logout</a>
                        </li>
                    </ul>
                </li>

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
                    <a
                        href='#/'
                        className={className}
                        onClick={() => { document.body.className = className; }}>
                    </a>
                </li>
            );
        }

        return result;
    }
}
