import React, {Component} from 'react';
import ici_avatar from '../assets/images/ici-avatar.jpg';


class Mmenu extends Component {
    render() {
        return (
            <div id="mmenu" className="right-panel">

                <ul className="nav nav-tabs nav-justified">
                    <li className="active"><a href={"/#mmenu-users"} data-toggle="tab"><i className="fa fa-users" /></a>
                    </li>
                    <li className=""><a href={"/#mmenu-history"} data-toggle="tab"><i className="fa fa-clock-o" /></a>
                    </li>
                    <li className=""><a href={"/#mmenu-friends"} data-toggle="tab"><i className="fa fa-heart" /></a>
                    </li>
                    <li className=""><a href={"/#mmenu-settings"} data-toggle="tab"><i className="fa fa-gear" /></a>
                    </li>
                </ul>


                <div className="tab-content">
                    <div className="tab-pane active" id="mmenu-users">
                        <h5><strong>Online</strong> Users</h5>

                        <ul className="users-list">

                            <li className="online">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Ing. Imrich <strong>Kamarel</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Ulaanbaatar, Mongolia</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="online">
                                <div className="media">

                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <span className="badge badge-red unread">3</span>

                                    <div className="media-body">
                                        <h6 className="media-heading">Arnold <strong>Karlsberg</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Bratislava, Slovakia</small>
                                        <span className="badge badge-outline status" />
                                    </div>

                                </div>
                            </li>

                            <li className="online">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />

                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Peter <strong>Kay</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Kosice, Slovakia</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="online">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">George <strong>McCain</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Prague, Czech Republic</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="busy">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Lucius <strong>Cashmere</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Wien, Austria</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="busy">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Jesse <strong>Phoenix</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Berlin, Germany</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                        </ul>

                        <h5><strong>Offline</strong> Users</h5>

                        <ul className="users-list">

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Dell <strong>MacApple</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Paris, France</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">

                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>

                                    <div className="media-body">
                                        <h6 className="media-heading">Roger <strong>Flopple</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Rome, Italia</small>
                                        <span className="badge badge-outline status" />
                                    </div>

                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />

                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Nico <strong>Vulture</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Kyjev, Ukraine</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Bobby <strong>Socks</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Moscow, Russia</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Anna <strong>Opichia</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Budapest, Hungary</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                        </ul>

                    </div>

                    <div className="tab-pane" id="mmenu-history">
                        <h5><strong>Chat</strong> History</h5>

                        <ul className="history-list">

                            <li className="online">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Ing. Imrich <strong>Kamarel</strong></h6>
                                        <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                            tempor</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="busy">
                                <div className="media">

                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <span className="badge badge-red unread">3</span>

                                    <div className="media-body">
                                        <h6 className="media-heading">Arnold <strong>Karlsberg</strong></h6>
                                        <small>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                            dolore eu fugiat nulla pariatur</small>
                                        <span className="badge badge-outline status" />
                                    </div>

                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />

                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Peter <strong>Kay</strong></h6>
                                        <small>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                            deserunt mollit </small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                        </ul>

                    </div>

                    <div className="tab-pane" id="mmenu-friends">
                        <h5><strong>Friends</strong> List</h5>
                        <ul className="favourite-list">

                            <li className="online">
                                <div className="media">

                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <span className="badge badge-red unread">3</span>

                                    <div className="media-body">
                                        <h6 className="media-heading">Arnold <strong>Karlsberg</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Bratislava, Slovakia</small>
                                        <span className="badge badge-outline status" />
                                    </div>

                                </div>
                            </li>

                            <li className="offline">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Anna <strong>Opichia</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Budapest, Hungary</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="busy">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Lucius <strong>Cashmere</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Wien, Austria</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                            <li className="online">
                                <div className="media">
                                    <a className="pull-left profile-photo" href={"/#"}>
                                        <img className="media-object" src={ici_avatar} alt={""} />
                                    </a>
                                    <div className="media-body">
                                        <h6 className="media-heading">Ing. Imrich <strong>Kamarel</strong></h6>
                                        <small><i className="fa fa-map-marker" /> Ulaanbaatar, Mongolia</small>
                                        <span className="badge badge-outline status" />
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                    <div className="tab-pane pane-settings" id="mmenu-settings">
                        <h5><strong>Chat</strong> Settings</h5>

                        <ul className="settings">

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">Show Offline Users</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-offline" checked />
                                            <label className="onoffswitch-label" htmlFor="show-offline">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">Show Fullname</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-fullname" />
                                            <label className="onoffswitch-label" htmlFor="show-fullname">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">History Enable</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-history" checked />
                                            <label className="onoffswitch-label" htmlFor="show-history">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">Show Locations</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-location" checked />
                                            <label className="onoffswitch-label" htmlFor="show-location">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">Notifications</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-notifications" />
                                            <label className="onoffswitch-label" htmlFor="show-notifications">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="form-group">
                                    <label className="col-xs-8 control-label">Show Undread Count</label>
                                    <div className="col-xs-4 control-label">
                                        <div className="onoffswitch greensea">
                                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                                   id="show-unread" checked />
                                            <label className="onoffswitch-label" htmlFor="show-unread">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </ul>

                    </div>


                </div>

            </div>
        );
    }
}

export default Mmenu;