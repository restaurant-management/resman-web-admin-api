import React, { Component } from 'react';
import '../assets/css/animate.css';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/chosen-bootstrap.css';
import '../assets/css/chosen.min.css';
import '../assets/css/ColVis.css';
import '../assets/css/component.css';
import '../assets/css/dataTables.bootstrap.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/jquery.mmenu.all.css';
import '../assets/css/jquery.videoBackground.css';
import '../assets/css/minimal.css';
import arnold_avatar from '../assets/images/arnold-avatar.jpg';
import george_avatar from '../assets/images/george-avatar.jpg';
import ici_avatar from '../assets/images/ici-avatar.jpg';
import peter_avatar from '../assets/images/peter-avatar.jpg';
import profile_photo from '../assets/images/profile-photo.jpg';
import AdvancedTable from '../components/advancedtable';
import Mmenu from '../components/mmenu';
import Flip3DHorizontal from '../components/Modals/3d-flip-horizontal';
import Flip3DVertical from '../components/Modals/3d-flip-vertical';
import RotateBottom3D from '../components/Modals/3d-rotate-bottom';
import RotateInLeft3D from '../components/Modals/3d-rotate-in-left';
import Sign3D from '../components/Modals/3d-sign';
import Slit3D from '../components/Modals/3d-slit';
import Blur from '../components/Modals/blur';
import FadeInScale from '../components/Modals/fade-in-scale';
import Fall from '../components/Modals/fall';
import JustMe from '../components/Modals/just-me';
import Newspaper from '../components/Modals/newspaper';
import OpenModalConfirmation from '../components/Modals/open-modal-comfirmation';
import OpenModalDialog from '../components/Modals/open-modal-dialog';
import SideFall from '../components/Modals/side-fall';
import SlideInBottom from '../components/Modals/slide-in-bottom';
import SlideInRight from '../components/Modals/slide-in-right';
import StickyUp from '../components/Modals/sticky-up';
import SuperScaled from '../components/Modals/super-scaled';
import SideBar from '../components/sidebar';

export default class Components extends Component<any, any> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            text: ''
        };
    }

    public componentDidMount = () => {
        document.body.classList.add('bg-1');
        this.setState({ showModal: true });

        fetch('/api/test').then((res: Response) => {
            return res.json();
        }).then((json) => {
            this.setState({
                text: json.message
            });
        });

        this.loadScript('/assets/js/jquery.js');
        this.loadScript('/assets/js/bootstrap.min.js');
        this.loadScript('/assets/js/bootstrap-dropdown-multilevel.js');
        this.loadScript('/assets/js/run_prettifyf793.js');
        this.loadScript('/assets/js/jquery.mmenu.min.js');
        this.loadScript('/assets/js/jquery.sparkline.min.js');
        this.loadScript('/assets/js/jquery.nicescroll.min.js');
        this.loadScript('/assets/js/jquery.animateNumbers.js');
        this.loadScript('/assets/js/jquery.videobackground.js');
        this.loadScript('/assets/js/jquery.blockUI.js');

        // Advanced Table.
        this.loadScript('/assets/js/chosen.jquery.min.js');
        this.loadScript('/assets/js/advancedTable.js');

        // Basic Datatable.
        this.loadScript('/assets/js/jquery.dataTables.min.js');
        this.loadScript('/assets/js/ColReorderWithResize.js');
        this.loadScript('/assets/js/dataTables.colVis.min.js');
        this.loadScript('/assets/js/ZeroClipboard.js');
        this.loadScript('/assets/js/dataTables.tableTools.min.js');
        this.loadScript('/assets/js/dataTables.bootstrap.js');
        this.loadScript('/assets/js/dataTable.js');

        // Modals Dialog.
        this.loadScript('/assets/js/modal-dialog.js');
        this.loadScript('/assets/js/jquery.jgrowl.min.js');
        this.loadScript('/assets/js/typeahead.min.js');
        this.loadScript('/assets/js/moment-with-langs.min.js');
        this.loadScript('/assets/js/bootstrap-datetimepicker.min.js');
        this.loadScript('/assets/js/jquery.nouislider.min.js');
        this.loadScript('/assets/js/bootstrap-tabdrop.min.js');
        this.loadScript('/assets/js/classie.js');
        this.loadScript('/assets/js/modalEffects.js');
        this.loadScript('/assets/js/cssParser.js');
        this.loadScript('/assets/js/css-filters-polyfill.js');

        this.loadScript('/assets/js/minimal.min.js');
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
        this.setState({ showModal: false });
    }

    public loadScript = (src: string, withType: boolean = false) => {
        const tag = document.createElement('script');
        tag.async = false;
        tag.src = src;
        if (withType) { tag.type = 'text/javascript'; }
        document.getElementsByTagName('body')[0].appendChild(tag);
    }

    public _renderLoad() {
        return (
            <div className='mask'>
                <div id='loader' />
            </div>
        );
    }

    public _renderWrap() {
        return (
            <div id={'wrap'}>
                <div className={'row'}>
                    <div className='navbar navbar-default navbar-fixed-top navbar-transparent-black mm-fixed-top'
                        role='navigation' id='navbar'>

                        <div className='navbar-header col-md-2'>
                            <a className='navbar-brand' href='/'>
                                <strong>RES</strong>MAN
                            </a>
                            <div className='sidebar-collapse'>
                                <a href='/#'>
                                    <i className='fa fa-bars' />
                                </a>
                            </div>
                        </div>

                        <div className='navbar-collapse'>
                            {/*Page Refresh*/}
                            <ul className='nav navbar-nav refresh'>
                                <li className='divided'>
                                    <a href='/#' className='page-refresh'><i className='fa fa-refresh' /></a>
                                </li>
                            </ul>
                            {/*/Page Refresh*/}

                            {/*Search*/}
                            <div className='search' id='main-search'>
                                <i className='fa fa-search' /> <input type='text' placeholder='Search...' />
                            </div>
                            {/*/Search*/}

                            {/*Quick Actions*/}
                            <ul className='nav navbar-nav quick-actions'>

                                <li className='dropdown divided'>

                                    <a className='dropdown-toggle button' data-toggle='dropdown' href='/#'>
                                        <i className='fa fa-tasks' />
                                        <span className='label label-transparent-black'>2</span>
                                    </a>

                                    <ul className='dropdown-menu wide arrow nopadding bordered'>
                                        <li><h1>You have <strong>2</strong> new tasks</h1></li>
                                        <li>
                                            <a href='/#'>
                                                <div className='task-info'>
                                                    <div className='desc'>Layout</div>
                                                    <div className='percent'>80%</div>
                                                </div>
                                                <div className='progress progress-striped progress-thin'>
                                                    <div className='progress-bar progress-bar-green' role='progressbar'
                                                        aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}
                                                        style={{ width: '80%' }}>
                                                        <span className='sr-only'>40% Complete (success)</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/#'>
                                                <div className='task-info'>
                                                    <div className='desc'>Schemes</div>
                                                    <div className='percent'>15%</div>
                                                </div>
                                                <div className='progress progress-striped active progress-thin'>
                                                    <div className='progress-bar progress-bar-cyan' role='progressbar'
                                                        aria-valuenow={45} aria-valuemin={0} aria-valuemax={100}
                                                        style={{ width: '15%' }}>
                                                        <span className='sr-only'>45% Complete</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/#'>
                                                <div className='task-info'>
                                                    <div className='desc'>Forms</div>
                                                    <div className='percent'>5%</div>
                                                </div>
                                                <div className='progress progress-striped progress-thin'>
                                                    <div className='progress-bar progress-bar-orange' role='progressbar'
                                                        aria-valuenow={45} aria-valuemin={0} aria-valuemax={100}
                                                        style={{ width: '5%' }}>
                                                        <span className='sr-only'>5% Complete (warning)</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/#'>
                                                <div className='task-info'>
                                                    <div className='desc'>JavaScript</div>
                                                    <div className='percent'>30%</div>
                                                </div>
                                                <div className='progress progress-striped progress-thin'>
                                                    <div className='progress-bar progress-bar-red' role='progressbar'
                                                        aria-valuenow={45} aria-valuemin={0} aria-valuemax={100}
                                                        style={{ width: '30%' }}>
                                                        <span className='sr-only'>30% Complete (danger)</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/#'>
                                                <div className='task-info'>
                                                    <div className='desc'>Dropdowns</div>
                                                    <div className='percent'>60%</div>
                                                </div>
                                                <div className='progress progress-striped progress-thin'>
                                                    <div className='progress-bar progress-bar-amethyst'
                                                        role='progressbar' aria-valuenow={45} aria-valuemin={0}
                                                        aria-valuemax={100} style={{ width: '60%' }}>
                                                        <span className='sr-only'>60% Complete</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li><a href='/#'>Check all tasks <i className='fa fa-angle-right' /></a></li>
                                    </ul>

                                </li>

                                <li className='dropdown divided'>

                                    <a className='dropdown-toggle button' data-toggle='dropdown' href='/#'>
                                        <i className='fa fa-envelope' />
                                        <span className='label label-transparent-black'>1</span>
                                    </a>

                                    <ul className='dropdown-menu wider arrow nopadding messages'>
                                        <li><h1>You have <strong>1</strong> new message</h1></li>
                                        <li>
                                            <a className='cyan' href='/#'>
                                                <div className='profile-photo'>
                                                    <img src={ici_avatar} alt='' />
                                                </div>
                                                <div className='message-info'>
                                                    <span className='sender'>Ing. Imrich Kamarel</span>
                                                    <span className='time'>12 mins</span>
                                                    <div className='message-content'>Duis aute irure dolor in
                                                        reprehenderit in voluptate velit esse cillum
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a className='green' href='/#'>
                                                <div className='profile-photo'>
                                                    <img src={arnold_avatar} alt='' />
                                                </div>
                                                <div className='message-info'>
                                                    <span className='sender'>Arnold Karlsberg</span>
                                                    <span className='time'>1 hour</span>
                                                    <div className='message-content'>Lorem ipsum dolor sit amet,
                                                        consectetur adipisicing elit
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href='/#'>
                                                <div className='profile-photo'>
                                                    <img src={profile_photo} alt='' />
                                                </div>
                                                <div className='message-info'>
                                                    <span className='sender'>John Douey</span>
                                                    <span className='time'>3 hours</span>
                                                    <div className='message-content'>Excepteur sint occaecat cupidatat
                                                        non proident, sunt in culpa qui officia
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a className='red' href='/#'>
                                                <div className='profile-photo'>
                                                    <img src={peter_avatar} alt='' />
                                                </div>
                                                <div className='message-info'>
                                                    <span className='sender'>Peter Kay</span>
                                                    <span className='time'>5 hours</span>
                                                    <div className='message-content'>Ut enim ad minim veniam, quis
                                                        nostrud exercitation
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a className='orange' href='/#'>
                                                <div className='profile-photo'>
                                                    <img src={george_avatar} alt='' />
                                                </div>
                                                <div className='message-info'>
                                                    <span className='sender'>George McCain</span>
                                                    <span className='time'>6 hours</span>
                                                    <div className='message-content'>Lorem ipsum dolor sit amet,
                                                        consectetur adipisicing elit
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li className='topborder'><a href='/#'>Check all messages <i
                                            className='fa fa-angle-right' /></a></li>
                                    </ul>

                                </li>

                                <li className='dropdown divided'>

                                    <a className='dropdown-toggle button' data-toggle='dropdown' href='/#'>
                                        <i className='fa fa-bell' />
                                        <span className='label label-transparent-black'>3</span>
                                    </a>

                                    <ul className='dropdown-menu wide arrow nopadding bordered'>
                                        <li><h1>You have <strong>3</strong> new notifications</h1></li>

                                        <li>
                                            <a href='/#'>
                                                <span className='label label-green'><i className='fa fa-user' /></span>
                                                New user registered.
                                                <span className='small'>18 mins</span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href='/#'>
                                                <span className='label label-red'><i
                                                    className='fa fa-power-off' /></span>
                                                Server down.
                                                <span className='small'>27 mins</span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href='/#'>
                                                <span className='label label-orange'><i className='fa fa-plus' /></span>
                                                New order.
                                                <span className='small'>36 mins</span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href='/#'>
                                                <span className='label label-cyan'><i
                                                    className='fa fa-power-off' /></span>
                                                Server restared.
                                                <span className='small'>45 mins</span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href='/#'>
                                                <span className='label label-amethyst'>
                                                    <i className='fa fa-power-off' />
                                                </span>
                                                Server started.
                                                <span className='small'>50 mins</span>
                                            </a>
                                        </li>

                                        <li><a href='/#'>Check all notifications <i className='fa fa-angle-right' /></a>
                                        </li>
                                    </ul>

                                </li>

                                <li className='dropdown divided user' id='current-user'>
                                    <div className='profile-photo'>
                                        <img src={profile_photo} alt='' />
                                    </div>
                                    <a className='dropdown-toggle options' data-toggle='dropdown' href='/#'>
                                        John Douey <i className='fa fa-caret-down' />
                                    </a>

                                    <ul className='dropdown-menu arrow settings'>

                                        <li>

                                            <h3>Backgrounds:</h3>
                                            <ul id='color-schemes'>
                                                <li><a href='/#' className='bg-1'> </a></li>
                                                <li><a href='/#' className='bg-2'> </a></li>
                                                <li><a href='/#' className='bg-3'> </a></li>
                                                <li><a href='/#' className='bg-4'> </a></li>
                                                <li><a href='/#' className='bg-5'> </a></li>
                                                <li><a href='/#' className='bg-6'> </a></li>
                                                <li className='title'>Solid Backgrounds:</li>
                                                <li><a href='/#' className='solid-bg-1'> </a></li>
                                                <li><a href='/#' className='solid-bg-2'> </a></li>
                                                <li><a href='/#' className='solid-bg-3'> </a></li>
                                                <li><a href='/#' className='solid-bg-4'> </a></li>
                                                <li><a href='/#' className='solid-bg-5'> </a></li>
                                                <li><a href='/#' className='solid-bg-6'> </a></li>
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
                                                <li><a href='/#' className='video-bg-1'> </a></li>
                                                <li><a href='/#' className='video-bg-2'> </a></li>
                                                <li><a href='/#' className='video-bg-3'> </a></li>
                                                <li><a href='/#' className='video-bg-4'> </a></li>
                                                <li><a href='/#' className='video-bg-5'> </a></li>
                                                <li><a href='/#' className='video-bg-6'> </a></li>
                                                <li><a href='/#' className='video-bg-7'> </a></li>
                                                <li><a href='/#' className='video-bg-8'> </a></li>
                                                <li><a href='/#' className='video-bg-9'> </a></li>
                                                <li><a href='/#' className='video-bg-10'> </a></li>
                                            </ul>

                                        </li>

                                        <li className='divider' />

                                        <li>
                                            <a href='/#'><i className='fa fa-user' /> Profile</a>
                                        </li>

                                        <li>
                                            <a href='/#'><i className='fa fa-calendar' /> Calendar</a>
                                        </li>

                                        <li>
                                            <a href='/#'><i className='fa fa-envelope' /> Inbox <span
                                                className='badge badge-red' id='user-inbox'>3</span></a>
                                        </li>

                                        <li className='divider' />

                                        <li>
                                            <a href='/#'><i className='fa fa-power-off' /> Logout</a>
                                        </li>
                                    </ul>
                                </li>

                                <li>
                                    <a href={'#mmenu'}><i className='fa fa-comments' /></a>
                                </li>
                            </ul>
                            {/*/Quick Actions*/}

                            <SideBar />
                        </div>
                    </div>

                    <div id='content' className='col-md-12' style={{ overflowY: 'scroll' }}>
                        <div className='pageheader'>
                            <h2><i className='fa fa-file-o' style={{ lineHeight: '48px', paddingLeft: 2 }} />
                                {' Blank Page '}<span> {this.state.text}.</span>
                            </h2>
                            <div className='breadcrumbs'>
                                <ol className='breadcrumb'>
                                    <li>You are here</li>
                                    <li><a href='/#'>Minimal</a></li>
                                    <li><a href='/#'>Example Pages</a></li>
                                    <li className='active'>Blank Page</li>
                                </ol>
                            </div>
                        </div>
                        <div className='main'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <AdvancedTable />
                                    {/* <BasicDatatable /> */}
                                    <OpenModalDialog />
                                    <OpenModalConfirmation />
                                </div>
                            </div>
                            <br />
                            <div className='row'>
                                <div className='col-md-12'>
                                    <FadeInScale />
                                    <SlideInRight />
                                    <SlideInBottom />
                                </div>
                            </div>
                            <br />
                            <div className='row'>
                                <div className='col-md-12'>
                                    <RotateBottom3D />
                                    <RotateInLeft3D />
                                    <Flip3DHorizontal />
                                    <Flip3DVertical />
                                    <Sign3D />
                                    <Slit3D />
                                </div>
                            </div>
                            <br />
                            <div className='row'>
                                <div className='col-md-12'>
                                    <Newspaper />
                                    <Fall />
                                    <SideFall />
                                    <StickyUp />
                                    <SuperScaled />
                                    <JustMe />
                                    <Blur />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Mmenu />
                </div>
            </div>
        );
    }

    public _renderVideo() {
        return (<section className='videocontent' id='video' />);
    }

    public render() {
        return [this._renderLoad(), this._renderWrap(), this._renderVideo()];
    }
}
