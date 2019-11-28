import React, { Component } from 'react';
import '../assets/css/animate.css';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/jquery.mmenu.all.css';
import '../assets/css/jquery.videoBackground.css';
import '../assets/css/minimal.css';
import { Breadcrumb } from '../components/breadcrumb';
import { LoadingIndicator } from '../components/loadingIndicator';
import { Navbar } from '../components/navbar/navbar';
import { VideoContent } from '../components/videoContent';

interface ScaffoldProp {
    readonly title: string;
    readonly icon?: string;
    readonly subTitle?: string;
}

export default class Scaffold extends Component<ScaffoldProp, any> {
    constructor(props: ScaffoldProp) {
        super(props);
    }

    public componentDidMount = () => {
        document.body.classList.add('bg-1');
        document.body.appendChild(VideoContent);
        document.body.appendChild(LoadingIndicator);

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

        this.loadScript('/assets/js/minimal.min.js');
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
    }

    public loadScript = (src: string, withType: boolean = false) => {
        const tag = document.createElement('script');
        tag.async = false;
        tag.src = src;
        if (withType) { tag.type = 'text/javascript'; }
        document.getElementsByTagName('body')[0].appendChild(tag);
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
                        <div className='row'>
                            <div className='col-md-12'>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
