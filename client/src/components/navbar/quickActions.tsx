import { ClickAwayListener, Grow } from '@material-ui/core';
import Image from 'material-ui-image';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

export interface QuickActionsState {
    setting?: { background: string };
    openUserBlock: boolean;
}

export class QuickActions extends Component<any, QuickActionsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            openUserBlock: false,
        };
    }

    public render() {
        return (
            <ul className='nav navbar-nav quick-actions'>
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
                                                openUserBlock: !this.state.openUserBlock
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
        this.setState({ openUserBlock: false });
    }
}
