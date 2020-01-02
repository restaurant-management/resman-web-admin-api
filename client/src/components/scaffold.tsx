import { Icon } from 'antd';
import 'antd/dist/antd.css';
import $ from 'jquery';
import React, { Component } from 'react';
import '../assets/css/agGridStyles.scss';
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
import '../assets/css/resman.scss';
import LoadingIndicator from '../components/loadingIndicator';
import { VideoContent } from '../components/videoContent';
import { LoadScriptFile } from '../utils/loadScript';
import { Breadcrumb } from './breadcrumb';
import { Navbar } from './navbar/navbar';
import { NotificationIndicator } from './notificationIndicator';

interface ScaffoldProp {
    readonly title: string;
    readonly icon?: string;
    readonly subTitle?: string;
}

// tslint:disable-next-line: variable-name
export const ScaffoldContext = React.createContext({});

export default class Scaffold extends Component<ScaffoldProp, any> {
    constructor(props: ScaffoldProp) {
        super(props);
        this.state = {
            loading: true,
            notify: false,
            notificationMessage: '',
            notificationVariant: null,
        };

        document.body.classList.add('bg-1');
        document.body.appendChild(VideoContent);

        LoadScriptFile('/assets/js/jquery.js');
        LoadScriptFile('/assets/js/bootstrap.min.js');
        LoadScriptFile('/assets/js/bootstrap-dropdown-multilevel.js');
        LoadScriptFile('/assets/js/jquery.mmenu.min.js');
        LoadScriptFile('/assets/js/jquery.sparkline.min.js');
        LoadScriptFile('/assets/js/jquery.nicescroll.min.js');
        LoadScriptFile('/assets/js/jquery.animateNumbers.js');
        LoadScriptFile('/assets/js/jquery.videobackground.js');
        LoadScriptFile('/assets/js/jquery.blockUI.js');
        LoadScriptFile('/assets/js/run_prettifyf793.js');

        LoadScriptFile('/assets/js/ag-grid-enterprise.min.js');

        LoadScriptFile('/assets/js/minimal.min.js');
    }

    public componentDidMount() {
        $(window).ready(() => {
            $('#loader').delay(500).fadeOut(300);
            $('.mask').delay(800).fadeOut(300);
        });
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
    }

    public showNotification() {
        this.setState({ notify: true });
    }

    public render() {
        return (<ScaffoldContext.Provider value={this}>
            <div id={'wrap'}>
                <LoadingIndicator show={this.state.loading} />
                <NotificationIndicator
                    variant={this.state.notificationVariant}
                    message={this.state.notificationMessage}
                    show={this.state.notify}
                    onClose={() => this.setState({ notify: false })}
                />
                <div className={'row'}>
                    <Navbar />
                    {/* <Mmenu /> */}
                    <div id='content' className='col-md-12 resman-content'>
                        <div className='pageheader'>
                            <h2>
                                {this.props.icon && this.props.icon.search('fa-') < 0 ? (
                                    <Icon type={this.props.icon} />
                                ) : (
                                        <i className= {`fa ${this.props.icon ? this.props.icon : 'fa-file-o'}`}/>
                            )}
                                {` ${this.props.title} `}
                                <span> {this.props.subTitle && `${this.props.subTitle}.`}</span>
                            </h2>
                            <Breadcrumb />
                        </div>
                        <div className='main'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        </ScaffoldContext.Provider>);
    }
}
