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
import '../assets/css/resman.scss';
import { Breadcrumb } from '../components/breadcrumb';
import { LoadingIndicator } from '../components/loadingIndicator';
import { Navbar } from '../components/navbar/navbar';
import { VideoContent } from '../components/videoContent';
import { LoadScriptFile } from '../utils/loadScript';

interface ScaffoldProp {
    readonly title: string;
    readonly icon?: string;
    readonly subTitle?: string;
}

export default class Scaffold extends Component<ScaffoldProp, any> {

    constructor(props: ScaffoldProp) {
        super(props);

        document.body.classList.add('bg-1');
        document.body.appendChild(VideoContent);
        document.body.appendChild(LoadingIndicator);

        LoadScriptFile('/assets/js/jquery.js');
        LoadScriptFile('/assets/js/bootstrap.min.js');
        LoadScriptFile('/assets/js/bootstrap-dropdown-multilevel.js');
        LoadScriptFile('/assets/js/run_prettifyf793.js');
        LoadScriptFile('/assets/js/jquery.mmenu.min.js');
        LoadScriptFile('/assets/js/jquery.sparkline.min.js');
        LoadScriptFile('/assets/js/jquery.nicescroll.min.js');
        LoadScriptFile('/assets/js/jquery.animateNumbers.js');
        LoadScriptFile('/assets/js/jquery.videobackground.js');
        LoadScriptFile('/assets/js/jquery.blockUI.js');

        LoadScriptFile('/assets/js/minimal.min.js');
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
    }

    public render() {
        return (<div id={'wrap'}>
            <div className={'row'}>
                <Navbar />
                {/* <Mmenu /> */}
                <div id='content' className='col-md-12' style={{ overflowY: 'scroll' }}>
                    <div className='pageheader'>
                        <h2>
                            <i className={`fa ${this.props.icon ? this.props.icon : 'fa-file-o'}`} style={{ lineHeight: '48px', paddingLeft: 2 }} />
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
        </div>);
    }
}
