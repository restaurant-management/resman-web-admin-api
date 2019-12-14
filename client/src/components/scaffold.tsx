import $ from 'jquery';
import React, { Component } from 'react';
import { Breadcrumb } from '../components/breadcrumb';
import LoadingIndicator from '../components/loadingIndicator';
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
        this.state = {
            loading: true
        };

        document.body.classList.add('bg-1');
        document.body.appendChild(VideoContent);
    }

    public componentDidMount() {
        LoadScriptFile('/assets/js/jquery.js', true, 'wrap');
        LoadScriptFile('/assets/js/bootstrap.min.js', true, 'wrap');
        LoadScriptFile('/assets/js/bootstrap-dropdown-multilevel.js', true, 'wrap');
        LoadScriptFile('/assets/js/run_prettifyf793.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.mmenu.min.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.sparkline.min.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.nicescroll.min.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.animateNumbers.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.videobackground.js', true, 'wrap');
        LoadScriptFile('/assets/js/jquery.blockUI.js', true, 'wrap');

        LoadScriptFile('/assets/js/ag-grid-enterprise.min.js');

        LoadScriptFile('/assets/js/minimal.min.js', true, 'wrap');

        $(window).ready(() => {
            $('#loader').delay(500).fadeOut(300);
            $('.mask').delay(800).fadeOut(300);
        });
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
    }

    public render() {
        return (<div id={'wrap'}>
            <LoadingIndicator show={this.state.loading} />
            <div className={'row'}>
                <Navbar />
                {/* <Mmenu /> */}
                <div id='content' className='col-md-12 resman-content'>
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
