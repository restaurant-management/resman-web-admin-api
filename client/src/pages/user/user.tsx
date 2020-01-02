import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { User } from '../../models/user';
import { Repository } from '../../repository';
import { UserService } from '../../service';
import { UserForm } from './userForm';

export function UserPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User>();

    const loadData = () => {
        setLoading(true);
        Repository.getAllUser().then((data) => {
            setUsers(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'} icon={'fa-user'}>
        <div className='row'>
            <div className='col-md-12'>
                <UserForm
                    visible={showCreateModal}
                    onCancel={() => setShowCreateModal(false)}
                    onCreate={() => loadData()}
                    user={editedUser}
                />
                <DataTable<User>
                    loading={loading}
                    exportFileName={'User'}
                    onMultiDelete={(async (items) => {
                        try {
                            enqueueSnackbar(await UserService
                                .deleteUsers(Repository.token, items.map(e => e.username)),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    })}
                    onEdit={async (user) => {
                        setLoading(true);
                        UserService.getUser(Repository.token, user.username)
                            .then(async (data) => {
                                setEditedUser(data);
                                setShowCreateModal(true);
                                setLoading(false);
                            })
                            .catch((e) => {
                                setLoading(false);
                                enqueueSnackbar(e.toString(), { variant: 'error' });
                            });
                    }}
                    onDelete={async (user) => {
                        try {
                            enqueueSnackbar(await UserService
                                .deleteUser(Repository.token, user.username),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={users}
                    autoSizeColumns={['username', 'birthday', 'email', 'roles', 'avatar']}
                    header={(<h1><strong>User</strong> Table</h1>)}
                    onCreate={() => {
                        setShowCreateModal(true);
                        setEditedUser(undefined);
                    }}
                    onReload={(callback) => {
                        loadData();
                        if (callback) {
                            callback();
                        }
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
                            tooltipValueGetter: (params) => params.value
                        }, {
                            headerName: 'Roles', field: 'roleNames'
                        }, {
                            headerName: 'Birthday', field: 'birthday',
                            cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : ''
                        }, {
                            headerName: 'Phone number', field: 'phoneNumber', minWidth: 100
                        }, {
                            headerName: 'Address', field: 'address', minWidth: 100,
                            tooltipField: 'address'
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
