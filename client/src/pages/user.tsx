import { Backdrop, Modal, Slide } from '@material-ui/core';
import moment from 'moment';
import React, { Component } from 'react';
import { DataTableColumn } from '../components/basicDatatable';
import { DataTable } from '../components/dataTable';
import Scaffold from '../components/scaffold';
import { User } from '../models/user';

export default class UserPage extends Component<any, any> {

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

    public fakeColumn: DataTableColumn[] = [
        { id: 'username', label: 'Username', sortType: 'sort-alpha', textCenter: true },
        { id: 'email', label: 'Email', sortType: 'sort-alpha' },
        { id: 'avatar', label: 'Avatar', type: 'image', textCenter: true, sortType: 'no-sort', titleCenter: true },
        { id: 'roles', label: 'Role', sortType: 'sort-alpha' },
        { id: 'birthday', label: 'Birthday', sortType: 'sort-alpha', type: 'date' },
        { id: 'address', label: 'Address', sortType: 'sort-alpha' },
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    public render() {
        return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
            <div className='row'>
                <div className='col-md-12'>
                    <Modal
                        disableEnforceFocus
                        open={this.state.showModal}
                        onBackdropClick={() => this.setState({ showModal: false })}
                        className='modal'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            overflowY: 'auto'
                        }}
                        onClose={() => this.setState({ showModal: false })}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500 }}
                    >
                        <Slide in={this.state.showModal} direction={'down'}>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <button type='button' className='close'
                                        onClick={() => this.setState({ showModal: false })}>
                                        Close
                                    </button>
                                    <h3 className='modal-title'>
                                        <strong>Modal</strong> title
                                        </h3>
                                </div>
                                <div className='modal-body'>
                                    <form>

                                        <div className='form-group'>
                                            <label htmlFor='exampleInput'>Normal input field</label>
                                            <input type='text' className='form-control' id='exampleInput' />
                                        </div>

                                        <div className='form-group'>
                                            <label htmlFor='passwordInput'>Password input field</label>
                                            <input type='password' className='form-control' id='passwordInput' />
                                        </div>

                                        <div className='form-group'>
                                            <label htmlFor='placeholderInput'>Input with placeholder</label>
                                            <input type='text' className='form-control' id='placeholderInput'
                                                placeholder='This is a placeholder...' />
                                        </div>

                                        <div className='form-group'>
                                            <label>Normal textarea</label>
                                            <textarea className='form-control' rows={3} />
                                        </div>

                                        <div className='form-group'>
                                            <label>Normal textarea</label>
                                            <textarea className='form-control' rows={3} />
                                        </div>

                                        <div className='form-group'>
                                            <label>Normal textarea</label>
                                            <textarea className='form-control' rows={3} />
                                        </div>

                                        <div className='form-group'>
                                            <label>Normal textarea</label>
                                            <textarea className='form-control' rows={3} />
                                        </div>

                                        <div className='form-group'>
                                            <label>Normal textarea</label>
                                            <textarea className='form-control' rows={3} />
                                        </div>

                                    </form>
                                </div>
                                <div className='modal-footer'>
                                    <button className='btn btn-red' data-dismiss='modal' aria-hidden='true'>
                                        Close
                                    </button>
                                    <button className='btn btn-green'>Save changes</button>
                                </div>
                            </div>
                        </Slide>
                    </Modal>

                    <DataTable<User>
                        exportFileName={'User'}
                        onView={(item) => console.log(item)}
                        onMultiDelete={(items => console.log(items))}
                        data={this.fakeData}
                        autoSizeColumns={['username', 'birthday', 'email', 'roles', 'avatar']}
                        header={(<h1><strong>User</strong> Table</h1>)}
                        onCreate={() => this.setState({ showModal: true })}
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
                            }
                        ]}
                    />
                </div>
            </div>
        </Scaffold>;
    }
}
