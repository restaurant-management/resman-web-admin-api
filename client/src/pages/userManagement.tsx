import moment from 'moment';
import React, { Component } from 'react';
import { DataTableColumn } from '../components/basicDatatable';
import { DataTable } from '../components/dataTable';
import { FormModal } from '../components/formModal';
import Scaffold from '../components/scaffold';
import { User } from '../models/user';

export default class UserManagement extends Component<any, any> {

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
                    <button
                        data-tip='Export to CSV'
                        onClick={() => {
                            console.log('aaaaaaaaaaaaaaaa');
                            this.setState({ showModal: true });
                        }}
                        className='resman-btn resman-cyan resman-left-border-radius'
                    >
                        <i className='fa fa-download'></i>
                        <span> Export</span>
                    </button>
                    <FormModal id={'edit-user'} isShowing={true} />
                    <DataTable<User>
                        onView={(item) => console.log(item)}
                        onMultiDelete={(items => console.log(items))}
                        data={this.fakeData}
                        autoSizeColumns={['username', 'birthday', 'email', 'roles', 'avatar']}
                        header={(<h1><strong>User</strong> Table</h1>)}
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
