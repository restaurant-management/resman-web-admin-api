import React, { Component } from 'react';
import AdvancedTable from '../components/advancedtable';
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
import Scaffold from '../components/scaffold';
import { LoadScriptFile } from '../utils/loadScript';

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

        // Advanced Table.
        LoadScriptFile('/assets/js/chosen.jquery.min.js');
        LoadScriptFile('/assets/js/advancedTable.js');

        // Basic Datatable.
        LoadScriptFile('/assets/js/jquery.dataTables.min.js');
        LoadScriptFile('/assets/js/ColReorderWithResize.js');
        LoadScriptFile('/assets/js/dataTables.colVis.min.js');
        LoadScriptFile('/assets/js/ZeroClipboard.js');
        LoadScriptFile('/assets/js/dataTables.tableTools.min.js');
        LoadScriptFile('/assets/js/dataTables.bootstrap.js');
        LoadScriptFile('/assets/js/dataTable.js');

        // Modals Dialog.
        LoadScriptFile('/assets/js/modal-dialog.js');
        LoadScriptFile('/assets/js/jquery.jgrowl.min.js');
        LoadScriptFile('/assets/js/typeahead.min.js');
        LoadScriptFile('/assets/js/moment-with-langs.min.js');
        LoadScriptFile('/assets/js/bootstrap-datetimepicker.min.js');
        LoadScriptFile('/assets/js/jquery.nouislider.min.js');
        LoadScriptFile('/assets/js/bootstrap-tabdrop.min.js');
        LoadScriptFile('/assets/js/classie.js');
        LoadScriptFile('/assets/js/modalEffects.js');
        LoadScriptFile('/assets/js/cssParser.js');
        LoadScriptFile('/assets/js/css-filters-polyfill.js');

        LoadScriptFile('/assets/js/minimal.min.js');
    }

    public componentWillUnmount = () => {
        document.body.classList.remove('bg-1');
        this.setState({ showModal: false });
    }

    public _renderWrap() {
        return (
            <Scaffold title={'Components'}>
                <div className='row'>
                    <div className='col-md-12'>
                        <AdvancedTable />
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
            </Scaffold>
        );
    }

    public render() {
        return this._renderWrap();
    }
}
