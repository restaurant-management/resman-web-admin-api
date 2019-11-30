import React, { Component } from 'react';
import BasicDatatable, { DataTableColumn } from '../components/basicDatatable';
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

    public render() {
        return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
            <div className='row'>
                <div className='col-md-12'>
                    <BasicDatatable<User>
                        data={this.fakeData.map(item => ({
                            ...item,
                            roles: [item.roles.join(', ')]
                        }))}
                        columns={this.fakeColumn}
                        hideTitle
                    />
                </div>
            </div>
        </Scaffold>;
    }
}
