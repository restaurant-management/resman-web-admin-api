import { AllCommunityModules, GridOptions } from '@ag-grid-community/all-modules';
import { AgGridReact } from '@ag-grid-community/react';
import moment from 'moment';
import React, { Component } from 'react';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import '../assets/css/agGridStyles.scss';
import { AgActions } from '../components/AgExtensions/agActions';
import { AgImage } from '../components/AgExtensions/agImage';
import { AgImageTooltip } from '../components/AgExtensions/agImageTooltip';
import Scaffold from '../components/scaffold';
import { User } from '../models/user';
import { LoadScriptFile } from '../utils/loadScript';
import { selectStyle } from '../utils/selectStyles';

export class AgGrid extends Component<any, any> {

    public fakeData: User[] = [
        {
            username: 'admin',
            email: 'hienlh1298@gmail.com',
            phoneNumber: '00000',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            roles: [
                'Administrator'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'staff',
            email: 'staff@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'Ha Noi'
        }, {
            username: 'chef',
            email: 'chef@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Chef'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        }, {
            username: 'ware_manager',
            email: 'ware_manager@gmail.com',
            avatar: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            phoneNumber: '00000',
            roles: [
                'Ware Manager',
                'Staff'
            ],
            birthday: new Date(1998, 1, 1),
            address: 'HCM City'
        },
    ];

    public gridOptions: GridOptions;

    private _pageSizeOptions = [10, 25, 50, 100].map(value => ({ value, label: `${value} rows/page` }));

    constructor(props: any) {
        super(props);
        this.state = {
            pagingSelected: this._pageSizeOptions[1]
        };

        this.gridOptions = {
            pagination: true,
            paginationPageSize: this.state.pagingSelected.value,
            rowSelection: 'multiple',
            unSortIcon: true,
            animateRows: true,
            rowHeight: 32,
            sideBar: true,
            floatingFilter: true,
            components: { AgImageTooltip },
            suppressRowClickSelection: true,
            onFirstDataRendered: (params) => {
                params.columnApi.autoSizeColumns(['username', 'birthday', 'email', 'roles', 'avatar']);
            }
        };

        LoadScriptFile('/assets/js/ag-grid-enterprise.min.js');
    }

    public render() {

        return (
            <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
                <ReactTooltip place='top' type='dark' effect='solid' />
                <div className='row'>
                    <div className='col-md-12'>
                        <section className='tile color transparent-black'>
                            <div className='tile-header'>
                                <div className='row' style={{ paddingTop: 10 }}>
                                    <div className='col-md-6'>
                                        <h1><strong>User</strong> Table</h1>
                                    </div>
                                    <div className='col-md-4'>
                                        <div style={{ float: 'right' }} >
                                            <button
                                                data-tip='Export to CSV'
                                                onClick={this._export.bind(this)}
                                                className='resman-btn resman-cyan resman-left-border-radius'
                                            >
                                                <i className='fa fa-download'></i>
                                                <span> Export</span>
                                            </button>
                                            <button
                                                data-tip='Delete all selected rows'
                                                className='resman-btn resman-danger resman-right-border-radius'
                                            >
                                                <i className='fa fa-trash-o'></i>{` Delete`}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='col-md-2'>
                                        <Select
                                            styles={selectStyle}
                                            onChange={(value) => {
                                                if (this.gridOptions.api) {
                                                    this.gridOptions.api.paginationSetPageSize(value.value);
                                                }
                                                this.setState({ pagingSelected: value });
                                            }}
                                            isSearchable
                                            value={this.state.pagingSelected}
                                            options={this._pageSizeOptions}
                                        />
                                    </div>
                                </div>
                                <div className='controls'>
                                    <a href='#/' className='minimize'><i className='fa fa-chevron-down' /></a>
                                    <a href='#/' className='refresh'><i className='fa fa-refresh' /></a>
                                    <a href='#/' className='remove'><i className='fa fa-times' /></a>
                                </div>
                            </div>
                            <div className='tile-widget'>
                                <div
                                    className='ag-theme-balham-dark'
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                >
                                    <AgGridReact
                                        gridOptions={this.gridOptions}
                                        domLayout={'autoHeight'}
                                        onGridReady={(params) => {
                                            params.api.sizeColumnsToFit();
                                        }}
                                        onGridSizeChanged={(params) => {
                                            params.api.sizeColumnsToFit();
                                        }}
                                        defaultColDef={{
                                            resizable: true,
                                            suppressSizeToFit: false,
                                            suppressAutoSize: false,
                                            sortable: true,
                                            filter: true,
                                        }}
                                        columnDefs={[
                                            {
                                                headerName: 'Username', field: 'username',
                                                cellClass: 'grid-cell-center', checkboxSelection: true,
                                                headerCheckboxSelection: true,
                                                headerCheckboxSelectionFilteredOnly: true
                                            }, {
                                                headerName: 'Email', field: 'email'
                                            }, {
                                                headerName: 'Avatar', field: 'avatar', sortable: false, filter: false,
                                                cellClass: 'grid-cell-center', suppressAutoSize: true,
                                                cellRenderer: 'AgImage', tooltipComponent: 'AgImageTooltip',
                                                tooltip: (params) => params.value,
                                                tooltipValueGetter: (params) => params.value,
                                            }, {
                                                headerName: 'Roles', field: 'roles'
                                            }, {
                                                headerName: 'Birthday', field: 'birthday',
                                                cellClass: 'grid-cell-center',
                                                cellRenderer: (params) => moment(params.value).format('DD/MM/YYYY')
                                            }, {
                                                headerName: 'Address', field: 'address', minWidth: 100,
                                                tooltipField: 'address',
                                            }, {
                                                headerName: 'Actions',
                                                cellClass: 'grid-cell-center',
                                                field: 'actions',
                                                cellRenderer: 'AgActions',
                                                pinned: 'right',
                                                filter: false,
                                                minWidth: 150,
                                                maxWidth: 200,
                                                sortable: false,
                                            },
                                        ]}
                                        rowData={this.fakeData}
                                        modules={AllCommunityModules}
                                        frameworkComponents={{ AgActions, AgImage }}
                                    ></AgGridReact>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </Scaffold>
        );
    }

    private _export() {
        if (this.gridOptions.api) {
            this.gridOptions.api.exportDataAsCsv({
                fileName: 'Users - Resman'
            });
        }
    }
}
